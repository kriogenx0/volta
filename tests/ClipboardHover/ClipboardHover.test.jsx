import { render } from '@testing-library/react';

import ClipboardHover from '../../components/ClipboardHover/ClipboardHover';

describe('ClipboardHover', () => {
  it('renders without crashing', () => {
    const { container } = render(<ClipboardHover />);
    expect(container).toBeInTheDocument();
  });
});
