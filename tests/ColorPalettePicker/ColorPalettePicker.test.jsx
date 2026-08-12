import { render } from '@testing-library/react';

import ColorPalettePicker from '../../components/ColorPalettePicker/ColorPalettePicker';

describe('ColorPalettePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ColorPalettePicker />);
    expect(container).toBeInTheDocument();
  });
});
