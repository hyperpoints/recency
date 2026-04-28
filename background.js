const inFlightByWindow = new Set();

async function isEnabled() {
	const { enabled = true } = await browser.storage.local.get("enabled");
	return enabled !== false;
}

browser.runtime.onInstalled.addListener(async () => {
	const state = await browser.storage.local.get("enabled");
	if (typeof state.enabled !== "boolean") {
		await browser.storage.local.set({ enabled: true });
	}
});

browser.runtime.onMessage.addListener((message) => {
	if (!message || typeof message !== "object") {
		return undefined;
	}

	if (message.type === "tab-recency:get-enabled") {
		return isEnabled();
	}

	if (message.type === "tab-recency:set-enabled") {
		const nextEnabled = message.enabled !== false;
		return browser.storage.local.set({ enabled: nextEnabled }).then(() => nextEnabled);
	}

	return undefined;
});

browser.tabs.onActivated.addListener(async (activeInfo) => {
	const windowId = activeInfo.windowId;

	if (inFlightByWindow.has(windowId)) {
		return;
	}

	inFlightByWindow.add(windowId);

	try {
		if (!(await isEnabled())) {
			return;
		}

		const activeTab = await browser.tabs.get(activeInfo.tabId);

		if (activeTab.pinned) {
			return;
		}

		const pinnedTabs = await browser.tabs.query({
			windowId,
			pinned: true,
		});

		const targetIndex = pinnedTabs.length;
		const isGrouped = activeTab.groupId !== -1;

		if (isGrouped) {
			const sourceGroupId = activeTab.groupId;
			const groupMetadata = await browser.tabGroups.get(sourceGroupId);

			const groupTabs = await browser.tabs.query({
				windowId,
				groupId: sourceGroupId,
			});

			const sortedIds = [
				activeTab.id,
				...groupTabs.filter((t) => t.id !== activeTab.id).map((t) => t.id),
			];

			await browser.tabs.move(sortedIds, { index: targetIndex });

			const newGroupId = await browser.tabs.group({
				tabIds: sortedIds,
			});

			const nextGroupState = {
				title: groupMetadata.title,
				color: groupMetadata.color,
			};

			if (typeof groupMetadata.collapsed === "boolean") {
				nextGroupState.collapsed = groupMetadata.collapsed;
			}

			await browser.tabGroups.update(newGroupId, nextGroupState);
		} else if (activeTab.index !== targetIndex) {
			await browser.tabs.move(activeTab.id, {
				index: targetIndex,
			});

			// If this move merged into the top group, pull the tab back out.
			const movedTab = await browser.tabs.get(activeTab.id);

			if (movedTab.groupId !== -1) {
				await browser.tabs.ungroup(activeTab.id);
			}
		}
	} catch (error) {
		console.debug("Stack transition interrupted", error);
	} finally {
		inFlightByWindow.delete(windowId);
	}
});
