import { useState } from 'react';

import DateInput from './DateInput';

const InteractiveDateInput = () => {
  const [value, setValue] = useState(new Date(2026, 0, 15));

  return (
    <div style={{ maxWidth: 280 }}>
      <DateInput
        value={value}
        minDate={new Date(2026, 0, 1)}
        maxDate={new Date(2026, 11, 31)}
        onChange={setValue}
      />
      <p style={{ margin: '10px 0 0', color: 'var(--v-color-trim-subtle)', fontSize: 12 }}>
        {value ? `Selected: ${value.toLocaleDateString()}` : 'No date selected'}
      </p>
    </div>
  );
};

export default {
  name: 'DateInput',
  description: 'A native, accessible date input with Date-based values and optional range constraints.',
  examples: [
    {
      name: 'Date with constraints',
      code: `const [value, setValue] = useState(new Date(2026, 0, 15));

<DateInput
  value={value}
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31)}
  onChange={setValue}
/>`,
      output: <InteractiveDateInput />,
    },
    {
      name: 'Readonly',
      code: `<DateInput
  value={new Date(2026, 0, 15)}
  format="MMMM d, yyyy"
  readonly
/>`,
      output: (
        <DateInput value={new Date(2026, 0, 15)} format="MMMM d, yyyy" readonly />
      ),
    },
  ],
};
