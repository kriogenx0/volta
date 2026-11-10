import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

export default {
  name: 'ErrorMessage',
  description: 'An error as a card in the error colour: a tinted background, a coloured edge and icon, and the text. It is a Message of type error, so it is announced to screen readers. Under a field it is passed role={null} and described to the control instead. ErrorText is another name for it.',
  examples: [
    {
      name: 'ErrorMessage',
      code: '<ErrorMessage message="Enter a valid email address." />',
      output: <ErrorMessage message="Enter a valid email address." />
    },
    {
      name: 'With a little markup',
      code: '<ErrorMessage message={<>Password needs <strong>at least 8 characters</strong>.</>} />',
      output: <ErrorMessage message={<>Password needs <strong>at least 8 characters</strong>.</>} />
    },
    {
      name: 'A longer message',
      code: '<ErrorMessage message="We could not save your changes because the server did not respond in time. Check your connection and try again." />',
      output: <ErrorMessage message="We could not save your changes because the server did not respond in time. Check your connection and try again." />
    },
    {
      name: 'Without the live region',
      code: '<ErrorMessage role={null} message="Shown under a field, not announced" />',
      output: <ErrorMessage role={null} message="Shown under a field, not announced" />
    }
  ]
};
