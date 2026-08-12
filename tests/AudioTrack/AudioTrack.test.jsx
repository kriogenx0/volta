import { render } from '@testing-library/react';

import AudioTrack from '../../components/AudioTrack/AudioTrack';

describe('AudioTrack', () => {
  it('renders without crashing', () => {
    const { container } = render(<AudioTrack />);
    expect(container).toBeInTheDocument();
  });
});
