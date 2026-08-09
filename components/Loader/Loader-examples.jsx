import Loader from './Loader';
import BlockLoader from './BlockLoader';

export default {
  name: 'Loader',
  description: 'A loader than usually spins.',
  examples: [
    {
      name: 'Loader',
      code: (
        '<Loader/>'
      ),
      output: (
        <Loader/>
      )
    },
    {
      name: 'Small Loader',
      code: (
        '<Loader size="small" />'
      ),
      output: (
        <Loader size="small" />
      )
    },
    {
      name: 'Block Loader',
      code: (
        '<BlockLoader />'
      ),
      output: (
        <div style={{height: 200}}>
          <BlockLoader />
        </div>
      )
    }
  ]
};
