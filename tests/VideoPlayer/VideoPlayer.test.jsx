import { render } from '@testing-library/react';

import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';

describe('VideoPlayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoPlayer />);
    expect(container).toBeInTheDocument();
  });
});
