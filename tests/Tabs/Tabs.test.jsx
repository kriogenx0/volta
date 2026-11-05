import { jsx } from 'react/jsx-runtime';
import { render } from '@testing-library/react';

import Tabs from '../../components/Tabs/Tabs';

describe('Tabs', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tabs />);
    expect(container).toBeInTheDocument();
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('Tabs with the automatic JSX runtime', () => {
  it('aligns left by default', () => {
    const { container } = render(jsx(Tabs, { tabs: ['One', 'Two'] }));
    expect(container.firstChild).toHaveClass('tab-align-left');
  });

  it('lets props override the alignment', () => {
    const { container } = render(jsx(Tabs, { tabs: ['One'], align: 'Right' }));
    expect(container.firstChild).toHaveClass('tab-align-right');
  });
});
