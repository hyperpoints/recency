# recency

WebExtension that keeps your most recently activated tab (or tab group) at the edge of the unpinned stack.

## Multi-browser build

This repo now builds separate extension bundles for Firefox, Chrome, and Safari from the same source files.

Run from the project root.

### Quick start

- Build everything: npm run build
- Build one target: npm run build:chrome (or build:firefox / build:safari)
- Build and zip one target: npm run package:chrome (or package:firefox / package:safari)

### All available npm commands

- `npm run build`: alias of `npm run build:all`.
- `npm run build:all`: build all targets.
- `npm run build:firefox`: build Firefox only.
- `npm run build:chrome`: build Chrome only.
- `npm run build:safari`: build Safari only.
- `npm run zip`: zip all built targets currently in dist.
- `npm run zip:firefox`: zip Firefox build only.
- `npm run zip:chrome`: zip Chrome build only.
- `npm run zip:safari`: zip Safari build only.
- `npm run package`: run `build:all`, then zip all targets.
- `npm run package:firefox`: build Firefox, then zip Firefox.
- `npm run package:chrome`: build Chrome, then zip Chrome.
- `npm run package:safari`: build Safari, then zip Safari.

Single-target builds only refresh that target under dist and keep other targets intact.

### Output folders

- Build outputs: `dist/firefox`, `dist/chrome`, `dist/safari`.
- Zip outputs: `artifacts/firefox.zip`, `artifacts/chrome.zip`, `artifacts/safari.zip`.

### Icons

- Source artwork: `icons/icon.svg`.
- Generated PNG sizes: `icons/icon-16.png`, `icons/icon-32.png`, `icons/icon-48.png`, `icons/icon-64.png`, `icons/icon-96.png`, `icons/icon-128.png`, `icons/icon-256.png`, `icons/icon-512.png`.

## Current behavior

- Pinned tabs are never moved.
- Activating a grouped tab moves its whole group to the selected side of unpinned tabs.
- Activating a lone tab moves it to the selected side of unpinned tabs.
- If a lone tab gets merged into a group while moving, it is immediately ungrouped.

## Quick toggle

Use the toolbar popup and switch Enabled on/off to pause or resume recency behavior.

Use Sort Side in the popup to choose where recent tabs/groups move:

- Left / Top: moves to the start of unpinned tabs.
- Right / Bottom: moves to the end of unpinned tabs.
