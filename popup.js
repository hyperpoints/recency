const ext = globalThis.browser ?? globalThis.chrome;
const toggle = document.getElementById("enabled-toggle");
const sortSide = document.getElementById("sort-side");
const statusText = document.getElementById("status");

function setStatus(message) {
	statusText.textContent = message;
}

async function loadState() {
	try {
		const settings = await ext.runtime.sendMessage({
			type: "tab-stack:get-settings",
		});

		toggle.checked = settings.enabled !== false;
		sortSide.value = settings.sortSide === "end" ? "end" : "start";
		setStatus(toggle.checked ? "Tab Stack is active." : "Tab Stack is paused.");
	} catch (error) {
		setStatus("Could not load state.");
		console.debug("Tab Stack popup load failed", error);
	}
}

toggle.addEventListener("change", async () => {
	toggle.disabled = true;

	try {
		const enabled = await ext.runtime.sendMessage({
			type: "tab-stack:set-enabled",
			enabled: toggle.checked,
		});

		toggle.checked = enabled !== false;
		setStatus(toggle.checked ? "Tab Stack is active." : "Tab Stack is paused.");
	} catch (error) {
		setStatus("Could not save state.");
		console.debug("Tab Stack popup save failed", error);
	} finally {
		toggle.disabled = false;
	}
});

sortSide.addEventListener("change", async () => {
	sortSide.disabled = true;

	try {
		const currentWindow = await ext.windows.getCurrent();
		const nextSortSide = await ext.runtime.sendMessage({
			type: "tab-stack:set-sort-side",
			sortSide: sortSide.value,
			windowId: currentWindow.id,
		});

		sortSide.value = nextSortSide === "end" ? "end" : "start";
		setStatus(toggle.checked ? "Tab Stack is active." : "Tab Stack is paused.");
	} catch (error) {
		setStatus("Could not save sort side.");
		console.debug("Tab Stack popup sort side save failed", error);
	} finally {
		sortSide.disabled = false;
	}
});

loadState();
