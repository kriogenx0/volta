import NumericField from '../../components/NumericField/NumericField';

export default {
  name: 'NumericField',
  description: 'A native number input with optional value formatting.',
  examples: [
    {
      name: 'Quantity with constraints',
      code: '<NumericField value={1} min={1} max={10} step={1} />',
      output: <NumericField value={1} min={1} max={10} step={1} />
    }
  ]
};
