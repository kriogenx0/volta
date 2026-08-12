// MultiSelect requires react-select and classnames
// import MultiSelect from '../../components/MultiSelect/MultiSelect';

export default {
  name: 'MultiSelect',
  description: 'A multi-value select powered by react-select with fixed-option support. Requires react-select and classnames as additional dependencies.',
  examples: [
    {
      name: 'API reference',
      code: `// npm install react-select classnames
import MultiSelect from 'volta/components/MultiSelect';

<MultiSelect
  name="tags"
  options={[
    { label: 'Design', value: 'design' },
    { label: 'Engineering', value: 'eng' },
    { label: 'Marketing', value: 'mkt' },
  ]}
  defaultValue={[{ label: 'Design', value: 'design' }]}
  onChange={(values) => console.log(values)}
/>`,
      output: (
        <div style={{ padding: '12px 16px', background: '#f8f9fa', borderRadius: 6, fontSize: 13, color: '#555' }}>
          <strong>MultiSelect</strong> requires <code>react-select</code> and <code>classnames</code> as peer dependencies.
          <br /><br />
          <code>npm install react-select classnames</code>
        </div>
      )
    },
  ]
};
