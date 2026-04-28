browser.tabs.onActivated.addListener(async (activeInfo) => {
	try {
		const activeTab = await browser.tabs.get(activeInfo.tabId);

		const pinnedTabs = await browser.tabs.query({
			currentWindow: true,
			pinned: true,
		});

		const targetIndex = pinnedTabs.length;

		if (activeTab.groupId && activeTab.groupId !== -1) {
			// === GROUP LOGIC ===

			// 1. Capture the "identity" of the group before it potentially dissolves
			const groupMetadata = await browser.tabGroups.get(activeTab.groupId);

			const groupTabs = await browser.tabs.query({
				currentWindow: true,
				groupId: activeTab.groupId,
			});

			// 2. Sort: Clicked tab goes to index 0, others follow
			const sortedIds = [
				activeTab.id,
				...groupTabs.filter((t) => t.id !== activeTab.id).map((t) => t.id),
			];

			// 3. Move the entire block to the top
			await browser.tabs.move(sortedIds, { index: targetIndex });

			// 4. THE FIX: Re-group these IDs immediately.
			// We create a fresh group and apply the old name/color.
			const newGroup = await browser.tabs.group({
				tabIds: sortedIds,
			});

			await browser.tabGroups.update(newGroup, {
				title: groupMetadata.title,
				color: groupMetadata.color,
			});
		} else {
			// === LONE TAB LOGIC ===

			if (activeTab.index !== targetIndex) {
				await browser.tabs.move(activeTab.id, {
					index: targetIndex,
				});

				// Leapfrog: If it got swallowed by the top group, yank it out
				const movedTab = await browser.tabs.get(activeTab.id);

				if (movedTab.groupId && movedTab.groupId !== -1) {
					await browser.tabs.ungroup(activeTab.id);
				}
			}
		}
	} catch (error) {
		console.debug("Stack transition interrupted", error);
	}
});
