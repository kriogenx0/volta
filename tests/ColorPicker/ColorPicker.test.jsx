import { render } from '@testing-library/react';

import ColorPicker from '../../components/ColorPicker/ColorPicker';

describe('ColorPicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ColorPicker />);
    expect(container).toBeInTheDocument();
  });
});
