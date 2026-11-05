import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent } from '@testing-library/react';

import VideoUploadPlayer from '../../components/VideoUploadPlayer/VideoUploadPlayer';

describe('VideoUploadPlayer', () => {
  it('renders without crashing', () => {
    const { container } = render(<VideoUploadPlayer />);
    expect(container).toBeInTheDocument();
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('VideoUploadPlayer with the automatic JSX runtime', () => {
  it('allows drag and drop by default', () => {
    render(jsx(VideoUploadPlayer, {}));
    fireEvent.dragOver(window, { dataTransfer: { types: ['Files'] } });
    expect(screen.getByText('Drop Here')).toBeInTheDocument();
  });

  it('ignores window drags when allowDragAndDrop is false', () => {
    render(jsx(VideoUploadPlayer, { allowDragAndDrop: false }));
    fireEvent.dragOver(window, { dataTransfer: { types: ['Files'] } });
    expect(screen.queryByText('Drop Here')).not.toBeInTheDocument();
  });
});
