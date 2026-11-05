import Message from '../../components/Message/Message';

export default {
  name: 'Message',
  description: 'An inline status message with an icon for a successful or failed action. Pass the text as message or as children; success is announced politely and error immediately.',
  examples: [
    {
      name: 'Success',
      code: '<Message type="success" message="Your changes were saved." />',
      output: <Message type="success" message="Your changes were saved." />
    },
    {
      name: 'Error',
      code: '<Message type="error" message="We could not reach the server. Try again." />',
      output: <Message type="error" message="We could not reach the server. Try again." />
    },
    {
      name: 'Markup as children',
      code: `<Message type="success">
  Invitation sent to <strong>ada@example.com</strong>.
</Message>`,
      output: (
        <Message type="success">
          Invitation sent to <strong>ada@example.com</strong>.
        </Message>
      )
    },
    {
      name: 'Both types together',
      code: `<Message type="success" message="3 of 4 files uploaded." />
<Message type="error" message="notes.pdf is larger than the 10 MB limit." />`,
      output: (
        <div className="example-stack">
          <Message type="success" message="3 of 4 files uploaded." />
          <Message type="error" message="notes.pdf is larger than the 10 MB limit." />
        </div>
      )
    }
  ]
};
