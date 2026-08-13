import LoaderLinearProgress from '../../components/LoaderLinearProgress/LoaderLinearProgress';

export default {
  name: 'LoaderLinearProgress',
  description: 'A 3px bar pinned to the top of the viewport. Indeterminate by default; pass a progress value (0-100) to show a determinate fill.',
  examples: [
    {
      name: 'Indeterminate',
      code: (
        '<LoaderLinearProgress />'
      ),
      output: (
        <div style={{ position: 'relative', height: 40, transform: 'translateZ(0)' }}>
          <LoaderLinearProgress />
        </div>
      )
    },
    {
      name: 'Determinate',
      code: (
        '<LoaderLinearProgress progress={65} />'
      ),
      output: (
        <div style={{ position: 'relative', height: 40, transform: 'translateZ(0)' }}>
          <LoaderLinearProgress progress={65} />
        </div>
      )
    }
  ]
};
