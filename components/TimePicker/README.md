# TimePicker

Pick a time of day: type an hour and minute or choose them from lists, and set am or pm.

## When to use

- **A time of day on its own:** an appointment slot, an opening time, a reminder.
- Use [`DateInput`](../DateInput/README.md) or [`DatePicker`](../DatePicker/README.md) to choose a date, and [`Select`](../Select/README.md) when only a few fixed times are allowed. For a duration or a plain number use [`NumericField`](../NumericField/README.md).
- It holds hour, minute and am or pm in its own state; you read the result in `onChange` and can seed it with `value`.

## Usage

```jsx
import { TimePicker } from 'volta';

<TimePicker
  value={time}
  minuteInterval={5}
  onChange={(picked) => setTime(picked.fullDate)}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string` \| `{ fullDate }` | | The time to show: `"15:30"`, `"3:30 pm"`, or the `{ fullDate }` object `onChange` gives. Applied whenever it changes; a value that can't be read is ignored. |
| `twentyFourHour` | `bool` | `false` | Hours 0 to 23 and no am or pm switch. Otherwise hours 1 to 12 and an am or pm control. |
| `minuteInterval` | `number` | `15` | The minutes offered in the list (00, 15, 30, 45 by default). Any minute from 0 to 59 can still be typed. |
| `onChange` | `function` | | Called with `{ hour, minute, pm, fullDate, formatted }` once an hour has been picked. |

What `onChange` receives: `hour` is a number (1 to 12, or 0 to 23 with `twentyFourHour`); `minute` is a two-digit string; `pm` is a boolean; `fullDate` is the 24-hour time as `"15:05"` (the hour is not zero-padded, so `"9:05"`); `formatted` is `"3:05 pm"`, or `"15:05"` with `twentyFourHour`. The minute defaults to `00` until one is chosen.

Typed text only counts when it is a valid hour (in range) or a minute from 0 to 59; on blur the box shows the last good value again.

## Accessibility

- The picker is a `role="group"` labelled "Time". The am or pm control is a `SegmentedControl` labelled "AM or PM", with `aria-pressed` buttons.
- The hour and minute boxes are text inputs with only the `hh` and `mm` placeholders as names; pair the picker with a visible label such as "Start time" in the surrounding form.
- Everything works from the keyboard: type the digits, or open the list (it opens on focus) and use Up and Down to highlight an entry, Enter to pick it and Escape to close it. That is [`ComboBox`](../ComboBox/README.md)'s behaviour.

## Do and don't

- Do set `twentyFourHour` where your users expect a 24-hour clock.
- Do store `fullDate` (or your own format) from `onChange` and pass it back as `value`.
- Don't use it to pick a date or a date and time together; use [`DatePicker`](../DatePicker/README.md) beside it.
- Don't rely on the `hh` and `mm` placeholders as the only label.
- Don't set `minuteInterval` to hide minutes; users can still type any minute.
