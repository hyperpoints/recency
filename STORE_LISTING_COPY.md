# Store Listing Copy

Reusable listing and review text for Firefox AMO, Chrome Web Store, and Safari distribution.

## Universal short summary
Keep your most recent tabs and tab groups at the edge of the tab strip, with one-click control over left/top or right/bottom sorting.

## Universal full description
Tab Stack keeps your active tabs easy to reach by automatically moving the currently selected tab, or its tab group, to your chosen side of the unpinned tab area.

What it does:
- Moves the active unpinned tab to the selected edge.
- Moves the whole group when the active tab belongs to a group.
- Leaves pinned tabs untouched.
- Preserves group metadata when regrouping.
- Lets you choose sort direction: Left/Top or Right/Bottom.
- Includes a popup toggle to pause or resume behavior instantly.

Why people use it:
- Faster tab switching in large tab sets.
- Less manual dragging.
- Predictable recent-tab placement.

Privacy:
- No account.
- No remote services.
- No telemetry.
- No data collection.

---

## Firefox AMO reviewer notes
Hello review team,

This extension reorders tabs in the current window based on tab activation events.

Behavior:
- On tab activation, the extension moves the active unpinned tab, or its tab group, to the selected edge of unpinned tabs.
- Pinned tabs are never moved.
- Users can enable or disable behavior and select sort side from the action popup.

Permissions used:
- tabs: read active tab state and move tabs.
- tabGroups: read, regroup, and update tab groups.
- storage: persist user settings (enabled state and sort side).

Data handling:
- The extension does not collect or transmit user data.
- browser_specific_settings.gecko.data_collection_permissions.required is set to ["none"].

Implementation notes:
- No remote code.
- No remote script execution.
- All logic is local to the extension package.

---

## Chrome Web Store listing copy
### Short description
Move active tabs and tab groups to your chosen edge of the tab strip.

### Description
Tab Stack automatically keeps your most recent tabs within easy reach.

- Moves the active unpinned tab to your selected side.
- Moves active tab groups together.
- Keeps pinned tabs in place.
- Lets you choose Left/Top or Right/Bottom sorting.
- Includes an on/off popup toggle.

No account, no telemetry, no remote services.

### Suggested privacy disclosure
This extension processes tab state locally to reorder tabs and groups. It does not collect, store, or transmit personal data.

---

## Safari listing copy
### Summary
Recent-tab and tab-group ordering with side selection.

### Description
Tab Stack keeps active tabs and groups near the edge you choose, so switching context stays fast without manual tab dragging.

Key points:
- Active tab or active group moves to chosen side.
- Pinned tabs stay untouched.
- Popup controls for enable or disable and sort side.
- Local-only behavior with no data collection.

---

## Release checklist text block
Use this for release notes or internal release steps.

1. Update manifest version.
2. Rebuild icons if artwork changed.
3. Run target build command.
4. Run zip or package command.
5. Upload target zip to store.
6. Reuse listing and reviewer text from this file.
