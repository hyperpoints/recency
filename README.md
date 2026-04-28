# recency

Firefox extension that keeps your most recently activated tab (or tab group) at the top of the unpinned stack.

## Current behavior

- Pinned tabs are never moved.
- Activating a grouped tab moves its whole group to the top of unpinned tabs.
- Activating a lone tab moves it to the top of unpinned tabs.
- If a lone tab gets merged into a group while moving, it is immediately ungrouped.

## Quick toggle

Use the toolbar popup and switch Enabled on/off to pause or resume recency behavior.

Use Sort Side in the popup to choose where recent tabs/groups move:

- Left / Top: moves to the start of unpinned tabs.
- Right / Bottom: moves to the end of unpinned tabs.
