import { render } from '@testing-library/react';

import ImagePicker from '../../components/ImagePicker/ImagePicker';

describe('ImagePicker', () => {
  it('renders without crashing', () => {
    const { container } = render(<ImagePicker />);
    expect(container).toBeInTheDocument();
  });
});
