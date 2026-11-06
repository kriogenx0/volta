# DateInput

The older name for [`DatePicker`](../DatePicker/README.md): importing `DateInput` gives the same component.

## When to use

- **Existing code that already imports `DateInput`.** It is `DatePicker` under another name (`DateInput === DatePicker`), kept so old screens keep working.
- In new code import `DatePicker`, which is documented in full at [`DatePicker`](../DatePicker/README.md), together with `CalendarMini` and `DateFormat`.
- There is nothing extra here: no props and no behaviour that `DatePicker` lacks.

## Usage

```jsx
import { DateInput } from 'volta';

<DateInput label="Due date" value={due} onChange={setDue} minDate={today} />;
```

## Props

These are the props of `DatePicker`, listed again for convenience. The full notes are in the `DatePicker` README.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `Date` | | The date shown. When given, the picker is controlled; `null` means no date. |
| `defaultValue` | `Date` | `null` | The starting date when `value` is not given. |
| `onChange` | `function` | | Called with a `Date` for the chosen day. |
| `format` | `string` | `'MMM d, yyyy'` | How the date is written in the box, with date-fns tokens. |
| `minDate` | `Date` | | Earlier days cannot be chosen. |
| `maxDate` | `Date` | | Later days cannot be chosen. |
| `disabled` | `bool` | | Native `disabled`; the calendar does not open. |
| `readonly` | `bool` | | Shows only the formatted date as text. |
| `required` | `bool` | | Passed to the text box. |
| `className` | `string` | `''` | Added to the root. |
| `data-qa-id` | `string` | | Prefix for the automated-test hook on the field. |

Any other prop goes to the text box (`label`, `placeholder`, `error`, `name`, `aria-*`).

## Accessibility

Identical to `DatePicker`: a read-only text input that announces a popup and opens a calendar of day buttons named with their full dates. Give it a `label` or `aria-label`. See the [`DatePicker`](../DatePicker/README.md) README for the details.

## Do and don't

- Do switch to the `DatePicker` import when you touch the file.
- Do read the `DatePicker` README for the props; they are the same.
- Don't add behaviour to `DateInput`; it is only a name.
- Don't expect a different look; it is the same component.
