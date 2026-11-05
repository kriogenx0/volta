import ProgressBar from '../../components/ProgressBar/ProgressBar';

export default {
  name: 'ProgressBar',
  description: 'A determinate bar takes a percent (0-100). Pass indeterminate, or leave percent out, to animate work of unknown length. fixed pins the bar to the top of the window as a page loader; LoaderLinearProgress is the same thing under its old name, with progress in place of percent.',
  examples: [
    {
      name: 'Determinate',
      code: (
        '<ProgressBar percent={50} />'
      ),
      output: (
        <ProgressBar percent={50} />
      )
    },
    {
      name: 'Empty and complete',
      code: (
        '<ProgressBar percent={0} />\n<ProgressBar percent={100} />'
      ),
      output: (
        <div className='example-stack'>
          <ProgressBar percent={0} />
          <ProgressBar percent={100} />
        </div>
      )
    },
    {
      name: 'Unknown progress',
      code: (
        '<ProgressBar />'
      ),
      output: (
        <ProgressBar />
      )
    },
    {
      name: 'Indeterminate prop',
      code: (
        '<ProgressBar indeterminate />\n<ProgressBar indeterminate percent={50} />'
      ),
      output: (
        <div className='example-stack'>
          <ProgressBar indeterminate />
          <ProgressBar indeterminate percent={50} />
        </div>
      )
    },
    {
      name: 'Indeterminate variants',
      code: (
        '<ProgressBar indeterminate variant="bouncing" />\n<ProgressBar indeterminate variant="flowing" />'
      ),
      output: (
        <div className='example-stack'>
          <ProgressBar indeterminate variant='bouncing' />
          <ProgressBar indeterminate variant='flowing' />
        </div>
      )
    },
    {
      name: 'Page loader, indeterminate',
      code: (
        '<ProgressBar fixed indeterminate variant="flowing" />'
      ),
      output: (
        <div className='example-fixed_frame'>
          <ProgressBar fixed indeterminate variant='flowing' />
        </div>
      )
    },
    {
      name: 'Page loader, determinate',
      code: (
        '<ProgressBar fixed percent={65} />'
      ),
      output: (
        <div className='example-fixed_frame'>
          <ProgressBar fixed percent={65} />
        </div>
      )
    }
  ]
};
