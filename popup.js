const toggle = document.getElementById("enabled-toggle");
const sortSide = document.getElementById("sort-side");
const statusText = document.getElementById("status");

function setStatus(message) {
	statusText.textContent = message;
}

async function loadState() {
	try {
		const settings = await browser.runtime.sendMessage({
			type: "tab-recency:get-settings",
		});

		toggle.checked = settings.enabled !== false;
		sortSide.value = settings.sortSide === "end" ? "end" : "start";
		setStatus(toggle.checked ? "Recency is active." : "Recency is paused.");
	} catch (error) {
		setStatus("Could not load state.");
		console.debug("Tab Recency popup load failed", error);
	}
}

toggle.addEventListener("change", async () => {
	toggle.disabled = true;

	try {
		const enabled = await browser.runtime.sendMessage({
			type: "tab-recency:set-enabled",
			enabled: toggle.checked,
		});

		toggle.checked = enabled !== false;
		setStatus(toggle.checked ? "Recency is active." : "Recency is paused.");
	} catch (error) {
		setStatus("Could not save state.");
		console.debug("Tab Recency popup save failed", error);
	} finally {
		toggle.disabled = false;
	}
});

sortSide.addEventListener("change", async () => {
	sortSide.disabled = true;

	try {
		const nextSortSide = await browser.runtime.sendMessage({
			type: "tab-recency:set-sort-side",
			sortSide: sortSide.value,
		});

		sortSide.value = nextSortSide === "end" ? "end" : "start";
		setStatus(toggle.checked ? "Recency is active." : "Recency is paused.");
	} catch (error) {
		setStatus("Could not save sort side.");
		console.debug("Tab Recency popup sort side save failed", error);
	} finally {
		sortSide.disabled = false;
	}
});

loadState();
