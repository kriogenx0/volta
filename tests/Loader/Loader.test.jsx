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

  describe('variants', () => {
    it('are the spinner, bars, clock and spin (the knob and block loaders are gone)', () => {
      expect(Loader.variants).toEqual(['spinner', 'bars', 'clock', 'spin']);
    });

    it('draws the spin loader as 12 arms', () => {
      const { container } = render(<Loader variant="spin" />);
      expect(container.querySelectorAll('.loader-spin .spin-arm')).toHaveLength(12);
    });

    it('fades the spin arms (opacity), where the old keyframes only changed a colour nothing used', () => {
      const fs = require('fs');
      const path = require('path');
      const scss = fs.readFileSync(path.join(__dirname, '../../components/Loader/Loader.scss'), 'utf8');
      expect(scss).toMatch(/animation:\s*spin-fade/);
      expect(scss).toMatch(/@keyframes spin-fade \{\s*0% \{ opacity: 1; \}\s*100% \{ opacity: 0\.15; \}/);
      expect(scss).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    });
  });
});
