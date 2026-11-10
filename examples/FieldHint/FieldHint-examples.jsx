import FieldHint from '../../components/FieldHint/FieldHint';
import FieldLabel from '../../components/FieldLabel/FieldLabel';
import TextBox from '../../components/TextBox/TextBox';

export default {
  name: 'FieldHint',
  description: 'Help text under a form control. Give it an id and point the control\'s aria-describedby at it, so a screen reader reads it with the control. Field, FieldRow, TextBox and Select do this for you with their hint prop; use FieldHint directly when you build a field by hand.',
  examples: [
    {
      name: 'A hint',
      code: '<FieldHint>Use your work address</FieldHint>',
      output: <FieldHint>Use your work address</FieldHint>
    },
    {
      name: 'Linked to a control by hand',
      code: `<FieldLabel htmlFor="work-email">Email</FieldLabel>
<TextBox id="work-email" type="email" aria-describedby="work-email-hint" />
<FieldHint id="work-email-hint">Use your work address</FieldHint>`,
      output: (
        <>
          <FieldLabel htmlFor="work-email">Email</FieldLabel>
          <TextBox id="work-email" type="email" aria-describedby="work-email-hint" />
          <FieldHint id="work-email-hint">Use your work address</FieldHint>
        </>
      )
    },
    {
      name: 'With the hint prop',
      code: '<TextBox label="Email" hint="Use your work address" type="email" />',
      output: <TextBox label="Email" hint="Use your work address" type="email" />
    },
    {
      name: 'Longer help text',
      code: '<FieldHint>Passwords need at least 12 characters. A phrase of four or five unrelated words works well and is easy to remember.</FieldHint>',
      output: <FieldHint>Passwords need at least 12 characters. A phrase of four or five unrelated words works well and is easy to remember.</FieldHint>
    }
  ]
};
