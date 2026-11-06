# TagInput

A text field that turns what you type into a list of tags: press Enter, comma or Space to add one.

## When to use

- **Collecting free-form keywords or labels** (skills, topics, email recipients) where each entry is one short word.
- Use [`Tag`](../Tag/README.md) to just display tags, [`MultiSelect`](../MultiSelect/README.md) or [`CheckboxGroup`](../CheckboxGroup/README.md) when the choices are a fixed list, and [`SearchSelector`](../SearchSelector/README.md) to pick from search results.
- Tags can't contain spaces: Space adds the tag, just as Enter and comma do.

## Usage

```jsx
import { TagInput } from 'volta';

<TagInput
  label="Topics"
  placeholder="Type a tag and press Enter"
  tags={['react', 'scss']}
  removable
  onChange={(tags) => setTopics(tags)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `tags` | `array` | `[]` | The tags to start with, as strings. Read once on mount; later changes to the prop are ignored. |
| `value` | `string` | `''` | The text to start the input with. Also read once. |
| `onChange` | `function` | | Called with the full array of tags when one is added or removed, not on each keystroke. |
| `removable` | `bool` | `false` | Shows an x button on each tag. Without it tags can't be removed. |

Every other prop goes to the [`TextField`](../TextField/README.md) (`label`, `placeholder`, `fieldSize`, `error`, `disabled`, ...), whose `name` defaults to `tags`. Adding a tag that is already in the list, or an empty one, does nothing. The keys that add a tag are listed in `TagInput.submitKeys`. Text that is typed but not submitted is not turned into a tag when the field loses focus.

## Accessibility

- The input is a normal text field: give it a `label` (or `aria-label`) so it has a name. The tags themselves are plain text after it.
- With `removable`, each x is a real `<button>` in the tab order with `aria-label="Remove <tag>"`, so it works from the keyboard.
- Adding or removing a tag is not announced by a live region; the visible list is the only feedback. Say how to add a tag in the label or placeholder.

## Do and don't

- Do tell people which key adds a tag, and set `removable` when they might make a mistake.
- Do keep tags short; they wrap on a narrow screen.
- Don't expect `tags` to control the list after mount; keep your own copy from `onChange`, or remount with a `key` to reset it.
- Don't use it for values that contain spaces or commas.
- Don't use it for a fixed set of options; use a [`MultiSelect`](../MultiSelect/README.md).
