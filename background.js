const ext = globalThis.browser ?? globalThis.chrome;
const inFlightByWindow = new Set();

async function getSettings() {
	const state = await ext.storage.local.get(["enabled", "sortSide"]);
	return {
		enabled: state.enabled !== false,
		sortSide: state.sortSide === "end" ? "end" : "start",
	};
}

async function reapplyForWindow(windowId) {
	const activeTabs = await ext.tabs.query({
		windowId,
		active: true,
	});

	if (!activeTabs[0]) {
		return;
	}

	await applyRecency({
		tabId: activeTabs[0].id,
		windowId,
	});
}

async function reapplyForLastFocusedWindow() {
	const activeTabs = await ext.tabs.query({
		active: true,
		lastFocusedWindow: true,
	});

	if (!activeTabs[0]) {
		return;
	}

	await applyRecency({
		tabId: activeTabs[0].id,
		windowId: activeTabs[0].windowId,
	});
}

ext.runtime.onInstalled.addListener(async () => {
	const state = await ext.storage.local.get(["enabled", "sortSide"]);
	const nextState = {};

	if (typeof state.enabled !== "boolean") {
		nextState.enabled = true;
	}

	if (state.sortSide !== "start" && state.sortSide !== "end") {
		nextState.sortSide = "start";
	}

	if (Object.keys(nextState).length > 0) {
		await ext.storage.local.set(nextState);
	}
});

ext.runtime.onMessage.addListener((message) => {
	if (!message || typeof message !== "object") {
		return undefined;
	}

	if (message.type === "recency:get-enabled") {
		return getSettings().then((settings) => settings.enabled);
	}

	if (message.type === "recency:set-enabled") {
		const nextEnabled = message.enabled !== false;
		return ext.storage.local.set({ enabled: nextEnabled }).then(() => nextEnabled);
	}

	if (message.type === "recency:get-settings") {
		return getSettings();
	}

	if (message.type === "recency:set-sort-side") {
		const nextSortSide = message.sortSide === "end" ? "end" : "start";
		return ext.storage.local.set({ sortSide: nextSortSide }).then(async () => {
			if (typeof message.windowId === "number") {
				await reapplyForWindow(message.windowId);
			} else {
				await reapplyForLastFocusedWindow();
			}
			return nextSortSide;
		});
	}

	return undefined;
});

async function applyRecency(activeInfo) {
	const windowId = activeInfo.windowId;

	if (inFlightByWindow.has(windowId)) {
		return;
	}

	inFlightByWindow.add(windowId);

	try {
		const settings = await getSettings();
		if (!settings.enabled) {
			return;
		}

		const activeTab = await ext.tabs.get(activeInfo.tabId);

		if (activeTab.pinned) {
			return;
		}

		const pinnedTabs = await ext.tabs.query({
			windowId,
			pinned: true,
		});

		const unpinnedTabs = await ext.tabs.query({
			windowId,
			pinned: false,
		});

		const startIndex = pinnedTabs.length;
		const endIndex = startIndex + unpinnedTabs.length - 1;
		const shouldMoveToEnd = settings.sortSide === "end";
		const targetIndex = shouldMoveToEnd ? -1 : startIndex;
		const isGrouped = activeTab.groupId !== -1;

		if (isGrouped) {
			const sourceGroupId = activeTab.groupId;
			const groupMetadata = await ext.tabGroups.get(sourceGroupId);

			const groupTabs = await ext.tabs.query({
				windowId,
				groupId: sourceGroupId,
			});

			const sortedIds = [
				activeTab.id,
				...groupTabs.filter((t) => t.id !== activeTab.id).map((t) => t.id),
			];

			await ext.tabs.move(sortedIds, { index: targetIndex });

			const newGroupId = await ext.tabs.group({
				tabIds: sortedIds,
			});

			const nextGroupState = {
				title: groupMetadata.title,
				color: groupMetadata.color,
			};

			if (typeof groupMetadata.collapsed === "boolean") {
				nextGroupState.collapsed = groupMetadata.collapsed;
			}

			await ext.tabGroups.update(newGroupId, nextGroupState);
		} else {
			const loneTargetIndex = shouldMoveToEnd ? endIndex : startIndex;
			if (activeTab.index === loneTargetIndex) {
				return;
			}

			await ext.tabs.move(activeTab.id, {
				index: targetIndex,
			});

			// If this move merged into an edge group, pull the tab back out.
			const movedTab = await ext.tabs.get(activeTab.id);

			if (movedTab.groupId !== -1) {
				await ext.tabs.ungroup(activeTab.id);
			}
		}
	} catch (error) {
		console.debug("Stack transition interrupted", error);
	} finally {
		inFlightByWindow.delete(windowId);
	}
}

ext.tabs.onActivated.addListener(applyRecency);
