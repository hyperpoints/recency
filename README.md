# recency

WebExtension that keeps your most recently activated tab (or tab group) at the edge of the unpinned stack.

## Multi-browser build

This repo now builds separate extension bundles for Firefox, Chrome, and Safari from the same source files.

Run from the project root:

- `npm run build` to build all targets.
- `npm run build:firefox` to build only Firefox.
- `npm run build:chrome` to build only Chrome.
- `npm run build:safari` to build only Safari.

To generate zip archives for store upload:

- `npm run zip` to zip all current dist targets.
- `npm run zip:firefox` to zip only Firefox.
- `npm run zip:chrome` to zip only Chrome.
- `npm run zip:safari` to zip only Safari.

One-shot build + zip commands:

- `npm run package`
- `npm run package:firefox`
- `npm run package:chrome`
- `npm run package:safari`

Build output folders:

- `dist/firefox`
- `dist/chrome`
- `dist/safari`

Archive output folder:

- `artifacts`

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
