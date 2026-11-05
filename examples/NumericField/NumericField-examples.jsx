import { useState } from 'react';

import NumericField from '../../components/NumericField/NumericField';

// onChange reports every keystroke; onBlurChange reports the formatted value
// once the user leaves the field, so that is the one to keep in state.
const Price = () => {
  const [typing, setTyping] = useState('');
  const [price, setPrice] = useState(19.5);

  return (
    <div>
      <NumericField aria-label="Price" value={price} onBlurFormat="twoDecimal" onChange={setTyping} onBlurChange={setPrice} />
      <p>Typing: {typing || '-'}</p>
      <p>Price: {price}</p>
    </div>
  );
};

// Returning null from whenTypingFormat rejects the keystroke.
const upToThreeDigits = (value) => (/^\d{0,3}$/.test(value) ? value : null);

export default {
  name: 'NumericField',
  description: 'A native number input that formats its value when you leave the field. Pick a built-in format ("integer", "twoDecimal"), a numeral.js format string such as "0.0", or your own function with onBlurFormat. Input props like min, max and step pass through to the input.',
  examples: [
    {
      name: 'Quantity with constraints',
      code: '<NumericField aria-label="Quantity" value={1} min={1} max={10} step={1} />',
      output: <NumericField aria-label="Quantity" value={1} min={1} max={10} step={1} />
    },
    {
      name: 'Formatted when you leave the field',
      code: `<NumericField aria-label="Amount" value={12.5} onBlurFormat="twoDecimal" />
<NumericField aria-label="Ratio" value={3.14159} onBlurFormat="0.0" />
<NumericField aria-label="Whole number" value={7.8} />`,
      output: (
        <div className="example-stack">
          <NumericField aria-label="Amount" value={12.5} onBlurFormat="twoDecimal" />
          <NumericField aria-label="Ratio" value={3.14159} onBlurFormat="0.0" />
          <NumericField aria-label="Whole number" value={7.8} />
        </div>
      )
    },
    {
      name: 'With state and change callbacks',
      code: `const [typing, setTyping] = useState('');
const [price, setPrice] = useState(19.5);

<NumericField
  aria-label="Price"
  value={price}
  onBlurFormat="twoDecimal"
  onChange={setTyping}
  onBlurChange={setPrice}
/>
<p>Typing: {typing || '-'}</p>
<p>Price: {price}</p>`,
      output: <Price />
    },
    {
      name: 'Limit what can be typed',
      code: `const upToThreeDigits = (value) => (/^\\d{0,3}$/.test(value) ? value : null);

<NumericField aria-label="Up to three digits" value={42} whenTypingFormat={upToThreeDigits} />`,
      output: <NumericField aria-label="Up to three digits" value={42} whenTypingFormat={upToThreeDigits} />
    },
    {
      name: 'Disabled',
      code: '<NumericField aria-label="Seats" value={24} disabled />',
      output: <NumericField aria-label="Seats" value={24} disabled />
    }
  ]
};
