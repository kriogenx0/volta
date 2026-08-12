import { render } from '@testing-library/react';

import VideoUploadPlayer from '../../components/VideoUploadPlayer/VideoUploadPlayer';

describe('VideoUploadPlayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoUploadPlayer />);
    expect(container).toBeInTheDocument();
  });
});
