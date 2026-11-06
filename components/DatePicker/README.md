# DatePicker

A date field: a text box that shows the chosen date and opens a one-month calendar to pick another.

## When to use

- **Picking one calendar day in a form** (a due date, a birthday), optionally limited to a range with `minDate` and `maxDate`.
- `DateInput` is the older name for the same component (see [`DateInput`](../DateInput/README.md)).
- A bare month grid without the text box is `CalendarMini`, below. A grid that returns a `Dater` is [`Calendar`](../Calendar/README.md). A time of day is a [`TimePicker`](../TimePicker/README.md).
- It picks a date only: no time, no range of two dates, and the user cannot type into the box.

## Usage

```jsx
import { DatePicker, CalendarMini, DateFormat } from 'volta';

<>
  <DatePicker label="Start date" value={start} onChange={setStart} minDate={today} />
  <DatePicker defaultValue={new Date(2026, 5, 15)} format="yyyy-MM-dd" readonly />
  <CalendarMini date={start} maxDate={deadline} onDateSelect={setStart} />
  {DateFormat({ date: start, format: 'MMM D, YYYY', empty: 'No date' })}
</>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `Date` | | The date shown. When it is given the picker is controlled; pass `null` for no date. A choice is reported, but the box changes only when the parent passes the new value. |
| `defaultValue` | `Date` | `null` | The starting date when `value` is not given. |
| `onChange` | `function` | | Called with a `Date` for the day the user chose. |
| `format` | `string` | `'MMM d, yyyy'` | How the date is written in the box, with date-fns tokens (`'yyyy-MM-dd'`). |
| `minDate` | `Date` | | Earlier days are greyed out and cannot be chosen. The day itself is allowed. |
| `maxDate` | `Date` | | Later days are greyed out and cannot be chosen. The day itself is allowed. |
| `disabled` | `bool` | | Native `disabled` on the text box; the calendar does not open. |
| `readonly` | `bool` | | Shows only the formatted date as text, with no box and no calendar. |
| `required` | `bool` | | Passed to the text box. |
| `className` | `string` | `''` | Added to the root. |
| `data-qa-id` | `string` | | Prefix for the automated-test hook on the field (`<prefix>_DatePicker`). |

Any other prop goes to the text box through `TextField` (`label`, `placeholder`, `error`, `name`, `id`, `fieldSize`, `aria-*`).

## CalendarMini props

`CalendarMini` is the calendar the picker opens: one month at a time, with "previous month", "next month" and "Mon YY" (jump to the current month) buttons.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `date` | `Date` | | The month shown first and the highlighted day. With none, the current month is shown and no day is highlighted. It is read again when it changes to a different moment. |
| `minDate` | `Date` | | Earlier days are disabled. |
| `maxDate` | `Date` | | Later days are disabled. |
| `onDateSelect` | `function` | | Called with a `Date` for the chosen day. |

## DateFormat

`DateFormat({ date, format, fromNow, empty })` is a plain function that returns a string (use it as `{DateFormat({ date })}`). It uses moment tokens, not the date-fns tokens of `DatePicker`'s `format`. `format` defaults to `'MMMM D, YYYY'`; `fromNow` gives "3 days ago" instead; `empty` (default `''`) is returned when there is no `date`.

## Accessibility

- The box is a read-only text input with `aria-haspopup="dialog"` and `aria-expanded`. It opens on focus or click, and closes on Escape, on a click outside, and when a day is chosen.
- Each day is a button named with its full date ("June 20, 2026"), `aria-pressed` for the chosen day, and `disabled` outside `minDate` and `maxDate`.
- Give the box a name with `label` (or `aria-label`).
- Opening on focus means tabbing into the box opens the calendar.

## Do and don't

- Do set `minDate` and `maxDate` instead of validating after the fact.
- Do pass `label` so the field has a visible name.
- Don't mix token styles: `format` here is date-fns (`yyyy-MM-dd`) and `DateFormat` is moment (`YYYY-MM-DD`).
- Don't rely on the user typing a date; the box cannot be typed into.
