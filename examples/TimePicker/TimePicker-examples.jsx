import { useState } from 'react';

import TimePicker from '../../components/TimePicker/TimePicker';

const Controlled = () => {
  const [time, setTime] = useState(null);
  return (
    <div>
      <TimePicker value={time ? time.fullDate : '14:30'} onChange={setTime} />
      <p>{time ? `Picked ${time.formatted}` : 'Starts at 2:30 pm'}</p>
    </div>
  );
};

export default {
  name: 'TimePicker',
  description: 'Pick an hour, minute and am/pm, or a 24-hour time, with seconds if you ask for them. Type a time, step the fields with the arrow keys, or choose from the dropdown that opens with both lists when either field has focus. onChange reports { hour, minute, pm, fullDate, formatted }.',
  examples: [
    {
      name: 'TimePicker',
      code: '<TimePicker onChange={(time) => console.log(time.formatted)} />',
      output: <TimePicker />
    },
    {
      name: 'With a starting value',
      code: `const [time, setTime] = useState(null);

<TimePicker value={time ? time.fullDate : '14:30'} onChange={setTime} />`,
      output: <Controlled />
    },
    {
      name: '24-hour clock with 5-minute steps',
      code: '<TimePicker twentyFourHour minuteInterval={5} value="18:45" />',
      output: <TimePicker twentyFourHour minuteInterval={5} value="18:45" />
    },
    {
      name: 'With seconds',
      code: '<TimePicker seconds value="3:05:09 pm" />',
      output: <TimePicker seconds value="3:05:09 pm" />
    },
    {
      name: '24-hour clock with seconds',
      code: '<TimePicker twentyFourHour seconds secondInterval={10} value="18:45:30" />',
      output: <TimePicker twentyFourHour seconds secondInterval={10} value="18:45:30" />
    }
  ]
};
