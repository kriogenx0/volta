// DateInput requires pikaday — install with: npm install pikaday
// import DateInput from './DateInput';

export default {
  name: 'DateInput',
  description: 'A date picker powered by Pikaday with date-fns formatting. Requires pikaday as an additional dependency.',
  examples: [
    {
      name: 'API reference',
      code: `// npm install pikaday
import DateInput from 'volta/components/DateInput';

<DateInput
  value="2026-01-15"
  onChange={(dateString) => console.log(dateString)}
  placeholder="Select a date"
/>`,
      output: (
        <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: 6, fontSize: 13, color: '#555' }}>
          <strong>DateInput</strong> requires <code>pikaday</code> as a peer dependency.
          <br /><br />
          <code>npm install pikaday</code>
        </div>
      )
    },
  ]
};
