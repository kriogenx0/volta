---
priority: p2
components: [ImagePicker, Message, FileUploader, FileManager, Icon, util]
branch: backlog/replace-font-awesome-icons-and-fix-file-size
---

# Check the drawn icons in place, in a real browser

Done on the branch above (see `docs/features/icons.md`):

- `ImagePicker`, `Message` and `FileUploader` no longer use Font Awesome classes. They use `Icon`, which now draws six icons as inline SVG (`trash`, `spinner`, `cloud-upload`, `check-circle`, `times-circle`, `arrow-up-circle`) with no font involved. `tests/noFontAwesome.test.js` keeps `fa-` classes out.
- `FileUtil.size` no longer calls an undefined function; it writes decimal sizes and is tested.

The task's plan to "use the library's own `Icon`" had a catch: `Icon`'s own font and SF Symbols icons also show nothing without fonts the library does not ship. So the three components use the new SVG icons, and the wider problem is its own task, `icons-show-only-where-sf-fonts-are-installed`.

## Unverified

The six glyphs were drawn and looked at on a sheet, but not in place. With the dev server (`make dev`), on the ImagePicker, Message and FileUploader pages:

1. **ImagePicker**: the empty picker shows a cloud-with-arrow, centred and large, in the muted grey; picking a file shows a spinning ring while it loads; with an image, the remove button shows a trash can, centred in its square, with hover and focus ring.
2. **Message**: the success and error messages each show their circle icon in the status colour, level with the text, with 8px before the text.
3. **FileUploader**: the upload arrow sits level with "Upload"; during an upload the cancel cross shows.
4. All three in light and dark, at desktop and 375px widths; the spinner holds still with the OS "reduce motion" setting.

If anything is off, fix it in the component's stylesheet or record a new task; otherwise delete this file.
