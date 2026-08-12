import IndicatorDot from '../../components/IndicatorDot/IndicatorDot';

export default {
  name: 'IndicatorDot',
  description: 'A small colored dot for status indicators.',
  examples: [
    {
      name: 'Default dot',
      code: '<IndicatorDot />',
      output: <IndicatorDot />
    },
    {
      name: 'Complete variant',
      code: '<IndicatorDot variant="complete" />',
      output: <IndicatorDot variant="complete" />
    },
    {
      name: 'Small size',
      code: '<IndicatorDot size="small" />',
      output: <IndicatorDot size="small" />
    },
    {
      name: 'Row of indicators',
      code: `<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
  <IndicatorDot variant="complete" /> Complete
  <IndicatorDot /> In Progress
</div>`,
      output: (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <IndicatorDot variant="complete" /> Complete
          &nbsp;&nbsp;
          <IndicatorDot /> In Progress
        </div>
      )
    },
  ]
};
