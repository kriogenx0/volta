import TextField, { TextBox } from '../../components/TextField/TextField';

export default {
  name: 'TextField',
  description: 'Input text field. TextBox is an alias for TextField that also adds the c-text_box wrapper class.',
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
    },
    {
      name: 'TextBox (alias)',
      code: (
        '<TextBox placeholder="Same as TextField" />'
      ),
      output: (
        <TextBox placeholder="Same as TextField" />
      )
    }
  ]
};
