import { render } from '@testing-library/react';

import FileUploader from '../../components/FileUploader/FileUploader';

describe('FileUploader', () => {
  it('renders without crashing', () => {
    const { container } = render(<FileUploader />);
    expect(container).toBeInTheDocument();
  });
});
