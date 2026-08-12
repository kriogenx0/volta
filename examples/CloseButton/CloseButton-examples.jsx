import CloseButton from '../../components/CloseButton';

export default {
  name: 'CloseButton',
  description: 'A minimal × button for dismissing dialogs, panels, and notifications.',
  examples: [
    {
      name: 'Close button',
      code: '<CloseButton onClick={() => alert("closed")} />',
      output: <CloseButton onClick={() => {}} />
    },
  ]
};
