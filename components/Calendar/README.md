# Calendar

A one-month calendar grid that hands back the day the user picks as a `Dater`.

## When to use

- **A standalone month to pick a day from**, in an existing screen that already works with `Dater`.
- For a date field in a form use [`DatePicker`](../DatePicker/README.md). For a month grid that returns a plain `Date` and can grey out days outside a range, use `CalendarMini` (documented in the same README).
- `Dater` is a small mutable date helper in this directory. It is not exported from `volta`.

## Usage

```jsx
import { Calendar } from 'volta';

<Calendar date={new Date(2026, 5, 15)} onDateSelect={(dater) => setDay(dater.cloneDate())} />;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `date` | `Date` \| `Dater` \| `number` \| `string` | today | The month shown first and the highlighted day. A timestamp or a date string is read as a date; an unreadable value means today. It is read again whenever it changes to a different moment. |
| `onDateSelect` | `function` | | Called with a `Dater` for the day that was chosen. |

A `Dater` has `dater.date` (a `Date`), `cloneDate()` (a copy as a `Date`), `day()`, `month()`, `year()` and `format()` (`M/D/YYYY`). Take a copy before you keep one: a `Dater` mutates when moved.

## Behaviour

- The header has "previous month" and "next month" buttons and a "Mon YY" button that jumps back to the current month. That jump does not call `onDateSelect`.
- Days are a 7-column grid, 40px cells, 280px wide, starting on Sunday. There are no weekday headings.
- The highlighted day is the day of the month of the date being browsed, so it stays on the same number as you page through months until you choose a day. `CalendarMini` keeps the real selection apart from the month being viewed.

## Accessibility

- Each day is a native `<button>` named with its full date ("June 15, 2026"), so it is reachable by Tab and works with Enter and Space. The highlighted day has `aria-current="date"`.
- The paging buttons are named "Previous month" and "Next month". The "Mon YY" button is named by its text (for example "Jun 26") and has the `title` "Show the current month".
- Blank cells before the 1st are hidden from assistive tech.
- The highlighted day is marked on screen by colour only (plus `aria-current` for screen readers).

## Do and don't

- Do keep the chosen day in your own state and pass it back as `date`.
- Do copy the day out of the `Dater` (`cloneDate()`) before storing it.
- Don't store the `Dater` itself in state and mutate it.
- Don't use it where a range of allowed days is needed; use `CalendarMini` with `minDate` and `maxDate`.
- Don't expect it to fit a container narrower than 280px; its width is fixed.
