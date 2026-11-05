import { jsx } from 'react/jsx-runtime';
import { render } from '@testing-library/react';

import Loader from '../../components/Loader/Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    expect(container).toBeInTheDocument();
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('Loader with the automatic JSX runtime', () => {
  it('defaults to the page-size spinner variant', () => {
    const { container } = render(jsx(Loader, {}));
    expect(container.firstChild).toHaveClass('volta-loader', 'loader-variant-spinner', 'loader-page');
    expect(container.querySelector('.loader')).toBeInTheDocument();
  });
});
