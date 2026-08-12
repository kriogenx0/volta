import TextField from '../../components/TextField/TextField';

export default {
  name: 'TextField',
  description: 'Input text field',
  examples: [
    {
      name: 'TextField',
      code: (
        '<TextField/>'
      ),
      output: (
        <TextField/>
      )
    },
    {
      name: 'TextField with placeholder',
      code: (
        '<TextField placeholder="Enter stuff here" />'
      ),
      output: (
        <TextField placeholder="Enter stuff here" />
      )
    },
    {
      name: 'TextField disabled',
      code: (
        '<TextField disabled={true} value="read only text here" />'
      ),
      output: (
        <TextField disabled={true} value="read only text here" />
      )
    },
    {
      name: 'Multi line text field similar to a textarea',
      code: (
        '<TextField multiline value="This is a really long paragraph that someone wrote into this textfield." />'
      ),
      output: (
        <TextField multiline value="This is a really long paragraph that someone wrote into this textfield." />
      )
    }
  ]
};
