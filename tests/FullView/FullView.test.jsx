import { jsx } from 'react/jsx-runtime';
import { render } from '@testing-library/react';

import FullView from '../../components/FullView/FullView';

describe('FullView', () => {
  it('renders without crashing', () => {
    const { container } = render(<FullView />);
    expect(container).toBeInTheDocument();
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('FullView with the automatic JSX runtime', () => {
  it('tracks window resizes by default (setScrollHeight)', () => {
    const add = jest.spyOn(window, 'addEventListener');
    const { unmount } = render(jsx(FullView, {}));
    expect(add.mock.calls.map(([type]) => type)).toContain('resize');
    unmount();
    add.mockRestore();
  });

  it('does not track resizes when setScrollHeight is false', () => {
    const add = jest.spyOn(window, 'addEventListener');
    render(jsx(FullView, { setScrollHeight: false }));
    expect(add.mock.calls.map(([type]) => type)).not.toContain('resize');
    add.mockRestore();
  });
});
