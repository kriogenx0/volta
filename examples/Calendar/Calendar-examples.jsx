import { useState } from 'react';

import Button from '../../components/Button/Button';
import Calendar from '../../components/Calendar/Calendar';

const LEAP_DAY = new Date(2024, 1, 29);
const NEW_YEAR = new Date(2027, 0, 1);
const LAST_OF_JANUARY = new Date(2026, 0, 31);

// Shows what onDateSelect hands back
const Picker = (props) => {
  const [picked, setPicked] = useState(null);
  return (
    <div className="example-stack">
      <Calendar onDateSelect={(dater) => setPicked(dater.format())} {...props} />
      <p>{picked ? `You picked ${picked}.` : 'Pick a day.'}</p>
    </div>
  );
};

// The calendar moves to a new date prop
const Jumper = () => {
  const [date, setDate] = useState(LEAP_DAY);
  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setDate(LEAP_DAY)}>Leap day 2024</Button>{' '}
        <Button onClick={() => setDate(NEW_YEAR)}>New year 2027</Button>
      </div>
      <Calendar date={date} />
    </div>
  );
};

export default {
  name: 'Calendar',
  description: 'A month of days to choose from. It opens on today, or on the date you give it, and onDateSelect is called with a Dater (use format() for m/d/yyyy) for each day clicked. The arrows change month and the month title returns to the current one.',
  examples: [
    {
      name: 'Current month',
      code: '<Calendar />',
      output: <Calendar />
    },
    {
      name: 'Picking a day',
      code: `const [picked, setPicked] = useState(null);

<Calendar onDateSelect={(dater) => setPicked(dater.format())} />
<p>{picked ? \`You picked \${picked}.\` : 'Pick a day.'}</p>`,
      output: <Picker />
    },
    {
      name: 'Starting on a given date',
      code: '<Calendar date={new Date(2024, 1, 29)} />',
      output: <Calendar date={LEAP_DAY} />
    },
    {
      name: 'Starting on the 31st',
      code: '<Calendar date={new Date(2026, 0, 31)} />',
      output: (
        <div className="example-stack">
          <p>Click the next arrow: February keeps its own days instead of skipping to March.</p>
          <Calendar date={LAST_OF_JANUARY} />
        </div>
      )
    },
    {
      name: 'Following the date prop',
      code: `const [date, setDate] = useState(new Date(2024, 1, 29));

<Button onClick={() => setDate(new Date(2024, 1, 29))}>Leap day 2024</Button>
<Button onClick={() => setDate(new Date(2027, 0, 1))}>New year 2027</Button>
<Calendar date={date} />`,
      output: <Jumper />
    }
  ]
};
