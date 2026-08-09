import ClipboardHover from './ClipboardHover';

export default {
  name: 'ClipboardHover',
  description: 'Wraps any text with a hover-reveal copy-to-clipboard button.',
  examples: [
    {
      name: 'Clipboard hover',
      code: '<ClipboardHover>npm install soda</ClipboardHover>',
      output: <ClipboardHover>npm install soda</ClipboardHover>
    },
    {
      name: 'Copy an email address',
      code: '<ClipboardHover>design@example.com</ClipboardHover>',
      output: <ClipboardHover>design@example.com</ClipboardHover>
    },
  ]
};
