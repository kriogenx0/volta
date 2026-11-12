import Loader from '../../components/Loader/Loader';

import './Loader-examples.scss';

export default {
  name: 'Loader',
  description: 'A loader with several animation variants, selected via the variant prop.',
  examples: [
    {
      name: 'Spinner (default)',
      code: (
        '<Loader/>'
      ),
      output: (
        <Loader/>
      )
    },
    {
      name: 'Small spinner',
      code: (
        '<Loader size="small" />'
      ),
      output: (
        <Loader size="small" />
      )
    },
    {
      name: 'Bars',
      code: (
        '<Loader variant="bars" />'
      ),
      output: (
        <Loader variant="bars" />
      )
    },
    {
      name: 'Clock',
      code: (
        '<Loader variant="clock" />'
      ),
      output: (
        <div className="example-loader_frame">
          <Loader variant="clock" />
        </div>
      )
    },
    {
      name: 'Spin',
      code: (
        '<Loader variant="spin" />'
      ),
      output: (
        <Loader variant="spin" />
      )
    }
  ]
};
