import ProgressBar from './ProgressBar';

export default {
  name: 'ProgressBar',
  description: null,
  examples: [
    {
      name: 'ProgressBar 50%',
      code: (
        '<ProgressBar percent={50} />'
      ),
      output: (
        <ProgressBar percent={50} />
      )
    },
    {
      name: 'ProgressBar unknown progress',
      code: (
        '<ProgressBar />'
      ),
      output: (
        <ProgressBar />
      )
    }
  ]
};
