import { render } from '@testing-library/react';

import ImageUploader from '../../components/ImageUploader/ImageUploader';

describe('ImageUploader', () => {
  it('renders without crashing', () => {
    const { container } = render(<ImageUploader />);
    expect(container).toBeInTheDocument();
  });
});
