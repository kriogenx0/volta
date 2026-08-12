import Thumb from '../../components/Thumb/Thumb';

export default {
  name: 'Thumb',
  description: 'Small fixed-size image thumbnail with a placeholder icon when no src is given.',
  examples: [
    {
      name: 'With image',
      code: "<Thumb src='https://picsum.photos/200' alt='Example' />",
      output: <Thumb src='https://picsum.photos/200' alt='Example' />
    },
    {
      name: 'Placeholder (no src)',
      code: "<Thumb alt='No image available' />",
      output: <Thumb alt='No image available' />
    }
  ]
};
