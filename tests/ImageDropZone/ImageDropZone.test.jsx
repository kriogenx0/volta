import { render } from '@testing-library/react';

import ImageDropZone from '../../components/ImageDropZone/ImageDropZone';

describe('ImageDropZone', () => {
  it('renders without crashing', () => {
    const { container } = render(<ImageDropZone />);
    expect(container).toBeInTheDocument();
  });
});
