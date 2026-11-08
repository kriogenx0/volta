---
priority: p2
components: Card, ClipboardHover, CKEditor, ComboBox, Calendar, DatePicker, Badge, NumericField, Loader, Map, MultiSelect, RadioGroup, Link, ListDefinitions, MobilePhone, Tabs, Tooltip, TimePicker, VideoUploadPlayer, VideoPlayer, Toggle, Tag, TextEditable, Slider, SearchSelector, TagInput, FilePicker, FileUploader, Label, Field, FieldRow, FormRow, FullView, IconButton, ImagePicker, BaseForm, Dropdown
---

# Fix what the component guidelines turned up

Writing `components/<Name>/README.md` for every component (docs/features/component_guidelines.md) meant reading each one; these are the problems found, read from the code and **not run**. Check each against the current code before fixing, since some are already covered by other tasks (listed last). Fix them in small groups, one per task branch, with a test each, and update the affected README when behaviour changes (its test fails when the props table drifts).

## Behaviour bugs

- **ComboBox:** ArrowDown or ArrowUp with no matches sets `highlightedIndex` to `NaN` (`% 0`). It forwards no `aria-label`, `id` or `name`, and has no combobox ARIA.
- **FilePicker:** with `multiple`, later picks push into the same state array and call `setFiles` with it, so React skips the re-render and the new file may not show. `loadIcon` asks `Icon` for `file`, `volume-up` and `video-camera`, which `icons.js` lacks (blank icon, "Icon type not recognized" in the console). The remove button has no `aria-label`.
- **FileUploader, VideoUploadPlayer:** `allowDragAndDrop={false}` only removes the page-wide cue; the box still accepts drops (VideoUploadPlayer's `handleDrop` also never calls `preventDefault`). `FileUploader`'s `onChange` is unguarded and `multiple` and `complete` are read but not in `propTypes`. VideoUploadPlayer throws on click while `percent` is set if `onCancel` is missing.
- **NumericField:** with the default `onBlurFormat="integer"`, 7.8 shows as 8 on first render, 12.5 becomes 13 on blur and an empty field becomes `0`. The default typing regex rejects `-`, so negatives can't be typed.
- **Calendar:** the highlighted day stays on the same day of the month while paging months. `Calendar` and `DatePicker` each carry their own slightly different copy of `Dater.js` and `Calendar.scss`.
- **VideoPlayer:** the `'loading'` status is never set (the `loadstart` branch is commented out), so the `Loader` branch is dead; no captions support (`<video>` children are fixed).
- **TextEditable:** `value` goes in through `dangerouslySetInnerHTML` and comes back as `innerHTML` (`&` returns as `&amp;`); changes to `value` after mount are ignored.
- **SearchSelector:** internal `open` closes on dismiss, so a parent that never resets `open` in `onClose` can't reopen it; selected chips can't be removed.
- **TagInput:** `tags` and `value` are read once on mount; uses the deprecated `onKeyPress`.
- **CKEditor:** no `onChange` and no form field when not editing, so a parent can't read the value; no stylesheet; fixed 870px wide (fallback textarea `cols=100`); uses `escape()`/`unescape()`.
- **BaseForm:** on a status other than 200, 201, 400 or 404, or on a network failure, no handler is called.
- **Dropdown:** with `showOverlay={false}` nothing closes it on an outside click.
- **Link:** a plain `<a>` (full page load), no `volta-link` stylesheet, `params` values are not URL-encoded.
- **Map:** `markers` propType is never used; initial `lat`/`lng` centre the map without a marker.
- **Loader:** `propTypes` omits `message`, `tiny` and `inline`, which it reads; `size="large"` has no CSS of its own.
- **Slider:** the default `max` is 2, not 100 (documented as is; confirm it is intended).
- **Tabs:** `activeClassName` is declared but never read.
- **ListDefinitions:** no `propTypes`. **FullView:** the component is named `SplitView` in its file, no `propTypes`, no `index.js`, measures with `offsetTop` (relative to the offset parent) only on mount and on resize. **FormRow:** declares `isValid` but never reads it. **Field:** `stack` adds a `field-stack` class with no CSS. **Label:** never imports `Label.scss`, which styles a class it doesn't render, so it has no styling. **RadioGroup:** renders its own bare radios, not `Radio`, and has no `disabled`, name or group role. **MobilePhone:** `.phone-display` has no height cap, so it never scrolls vertically. **Icon examples:** `Icon-examples.jsx` lists names `icons.js` doesn't have (`bell`, `heart`, `person`, `arrow.right`, ...) and uses `size="large"`, which `Icon.sizes` rejects.

## Accessibility and keyboard

- **ClipboardHover:** the copy button is `display: none` until hover, so keyboard and touch users can't reach it; icon-only with no `aria-label`; uses the legacy `tiny` prop.
- **Tabs:** tabs are `<li onClick>` with no role, tabindex or key handler. **TabsRouted:** the active tab differs only by text colour (plus `aria-current`).
- **Card `selectable`:** only a pointer cursor; no role, tabindex, keys or hover state.
- **Toggle:** hover scales the knob 1.06, against design principle 7; announced as a checkbox, not a switch.
- **Tag:** `deletable` draws an `aria-hidden` x that isn't its own target, so the whole tag calls `onClick`.
- **Tooltip:** `aria-describedby` is on the wrapper span, not the focusable child; can't be dismissed with Escape.
- **NavBar:** renders a `div` not a `nav`, no `aria-current`; `NavItem` isn't exported, so it can't be used from `volta`.
- **ModalDialog:** never passes `headerTitle` to `Modal`, so the `role="dialog"` panel has no accessible name.
- **ProgressBar, LoaderLinearProgress:** forward no extra props, so no `aria-label`. **Loader:** no `role` or `aria-live`.
- **ActionMenu:** the trigger's `aria-label` is fixed at "Actions".
- **TimePicker:** the hour and minute inputs are named only by their `hh` and `mm` placeholders.
- **MultiSelect:** no `inputId` prop, so a `<label for>` can't point at it. **MapSelector:** its "Loading..." and "Location not found." messages aren't in a live region.
- **FileUploader, VideoUploadPlayer:** the click box (and Upload and cancel) are plain `div`s with no role, tabindex or keys.
- **ImagePicker:** the transparent file input has no focus style. **IconButton:** `padding: 0` makes the tap target the icon size (16px default). **GlobalNav:** no narrow-screen layout; a few links overflow 375px. **ListCardRow:** doesn't forward `aria-label` or other props.
- **Field, FieldRow, FormRow:** the labels are a `div`, a `div` and a `p`, not tied to their controls (`design-system.md` rule 9 says `Field` gives label, hint and error; `Field` has only `label`, `type`, `stack`, `className`, `children`).
- **DatePicker:** read from the code, not run: `Dropdown`'s focus return targets the `TextField` wrapper `div`, which isn't focusable, so focus probably isn't restored to the input after the calendar closes.

## Design-system rule violations

- **Contrast:** `Card` default text and `Empty` text are `--v-color-base-less-subtle` (#ccc on white), far below 4.5:1.
- **Hard-coded colours:** `Badge` icon variants (`check`, `bluecheck`, `x`), `GlobalNav` (`#333`, `#fff`, `#aaa`, `#888`), `Loader` variants (`#333`, `#09c`, `#E08764`, `#1fbeca`, ...), `NavBar` (`color: black`, unreadable in dark mode), `Tooltip` (`legacy-color('dark-gray')`). `Badge` ignores `style`.
- **Z-index numbers:** `Drawer` uses -1000, 50, 100, 200.
- **Legacy `$color_*` variables:** Select, TextField, Tabs, Tag, TagInput, Toggle, Radio. **Off-scale spacing:** `ListDefinitions.scss` 15px.
- **Font Awesome:** `FileUploader` and `ImagePicker` render `fa fa-*` classes with no Font Awesome CSS. **Icon fonts:** `Icon.scss` names `Volta Icons` and `SF_Symbol`/`SF Pro`, with no `@font-face` in the repo, so the host page has to supply them.
- **Dialog:** its Save button is always `primary`, so a destructive confirm has no danger variant. **BaseForm:** its submit is a native element with `btn btn-primary`, not Volta's `Button`.
- **Map:** the Google Maps key is hard-coded in `Map.jsx` and the script loads from the network.

## Probably covered by other tasks (check `docs/backlog/` and the open `backlog/*` branches first)

- No focus move, trap or return and no `aria-modal` on Dialog, Modal, ModalDialog, PopOver, Alert, Overlay, Drawer: `overlay-scroll-lock-and-focus`.
- Icon-only buttons without `aria-label`: `require-aria-label-on-icon-buttons`. Missing hover, focus or keyboard states: `audit-interactive-states`. Contrast: `resolve-contrast-failures`.
- Font Awesome classes: `replace-font-awesome-icons-and-fix-file-size`. Legacy colour variables and hex literals: `migrate-legacy-color-variables`, `replace-hex-literals-in-component-scss`. Z-index numbers: `replace-z-index-numbers`.
- Class components (`Map`, `MapSelector`, `ImageCrop`): `convert-class-components-to-hooks`. ImageCrop touch, keyboard and Escape: `image-crop-touch-and-keyboard`. The Maps key: `google-maps-key-to-config`.

## Acceptance

Each fix has a test, the component's README still passes `tests/componentReadmes.test.js`, and this file loses the items it fixed (delete the file when it is empty).
