// DateTime requires pikaday and classnames
// import DateTime from './DateTime';

export default {
  name: 'DateTime',
  description: 'Full date/time picker with date ranges and time inputs. Requires pikaday and classnames as additional dependencies.',
  examples: [
    {
      name: 'API reference',
      code: `// npm install pikaday classnames
import DateTime from 'soda/components/DateTime';

<DateTime
  value="2026-01-15T09:00"
  onChange={(val) => console.log(val)}
/>`,
      output: (
        <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: 6, fontSize: 13, color: '#555' }}>
          <strong>DateTime</strong> requires <code>pikaday</code> and <code>classnames</code> as peer dependencies.
          <br /><br />
          <code>npm install pikaday classnames</code>
          <br /><br />
          Includes subcomponents: <code>DateRange</code>, <code>TimeRange</code>, <code>TimeInput</code>, <code>Readonly</code>
        </div>
      )
    },
  ]
};
