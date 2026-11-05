import { useState } from 'react';
import { format } from 'date-fns';

import DatePicker from '../../components/DatePicker/DatePicker';

const Controlled = () => {
  const [date, setDate] = useState(null);

  return (
    <div className="example-stack">
      <DatePicker label="Start date" placeholder="Choose a date" value={date} onChange={setDate} />
      <p>Selected: {date ? format(date, 'yyyy-MM-dd') : 'none'}</p>
    </div>
  );
};

const WithDefault = () => {
  const [last, setLast] = useState('nothing yet');

  return (
    <div className="example-stack">
      <DatePicker label="Due date" defaultValue={new Date(2026, 5, 15)} onChange={(date) => setLast(format(date, 'PPP'))} />
      <p>Last change: {last}</p>
    </div>
  );
};

export default {
  name: 'DatePicker',
  description: 'A date field that opens a month calendar in a dropdown. Control it with value and onChange, or give it a defaultValue and let it keep its own state. minDate and maxDate limit the days, and format changes how the date is written.',
  examples: [
    {
      name: 'Controlled with state',
      code: `const [date, setDate] = useState(null);

<DatePicker label="Start date" placeholder="Choose a date" value={date} onChange={setDate} />`,
      output: <Controlled />
    },
    {
      name: 'Starting date and change callback',
      code: `<DatePicker
  label="Due date"
  defaultValue={new Date(2026, 5, 15)}
  onChange={(date) => console.log(date)}
/>`,
      output: <WithDefault />
    },
    {
      name: 'Limited to a range',
      code: `<DatePicker
  label="Delivery date"
  defaultValue={new Date(2026, 5, 15)}
  minDate={new Date(2026, 5, 10)}
  maxDate={new Date(2026, 5, 20)}
/>`,
      output: (
        <DatePicker
          label="Delivery date"
          defaultValue={new Date(2026, 5, 15)}
          minDate={new Date(2026, 5, 10)}
          maxDate={new Date(2026, 5, 20)}
        />
      )
    },
    {
      name: 'Custom date format',
      code: `<DatePicker
  label="Birthday"
  format="EEEE, MMMM d, yyyy"
  defaultValue={new Date(1990, 2, 7)}
/>`,
      output: <DatePicker label="Birthday" format="EEEE, MMMM d, yyyy" defaultValue={new Date(1990, 2, 7)} />
    },
    {
      name: 'Disabled and read-only',
      code: `<DatePicker label="Locked" disabled defaultValue={new Date(2026, 0, 1)} />
<DatePicker readonly defaultValue={new Date(2026, 0, 1)} />`,
      output: (
        <div className="example-stack">
          <DatePicker label="Locked" disabled defaultValue={new Date(2026, 0, 1)} />
          <DatePicker readonly defaultValue={new Date(2026, 0, 1)} />
        </div>
      )
    }
  ]
};
