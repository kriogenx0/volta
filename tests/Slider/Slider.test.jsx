import { render } from '@testing-library/react';

import Slider from '../../components/Slider/Slider';

describe('Slider', () => {
  it('renders without crashing', () => {
    const { container } = render(<Slider />);
    expect(container).toBeInTheDocument();
  });
});
