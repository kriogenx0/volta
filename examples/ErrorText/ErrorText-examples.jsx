import ErrorText from '../../components/ErrorText/ErrorText';
import TextBox from '../../components/TextBox/TextBox';

export default {
  name: 'ErrorText',
  description: 'Red helper text for a validation error, shown under the control it belongs to. It takes a plain string or a little markup for emphasis.',
  examples: [
    {
      name: 'Message',
      code: '<ErrorText message="Enter a valid email address." />',
      output: <ErrorText message="Enter a valid email address." />
    },
    {
      name: 'With emphasis',
      code: '<ErrorText message={<>Password needs <strong>at least 8 characters</strong>.</>} />',
      output: <ErrorText message={<>Password needs <strong>at least 8 characters</strong>.</>} />
    },
    {
      name: 'Long message wraps',
      code: '<ErrorText message="We could not save your changes because the server did not respond in time. Check your connection and try again in a moment." />',
      output: <ErrorText message="We could not save your changes because the server did not respond in time. Check your connection and try again in a moment." />
    },
    {
      name: 'Under a text field',
      code: '<TextBox label="Email" defaultValue="not-an-email" error="Enter a valid email address." />',
      output: <TextBox label="Email" defaultValue="not-an-email" error="Enter a valid email address." />
    }
  ]
};
