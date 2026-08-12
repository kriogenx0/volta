import { render } from '@testing-library/react';

import FileManager from '../../components/FileManager/FileManager';

describe('FileManager', () => {
  it('renders without crashing', () => {
    const { container } = render(<FileManager />);
    expect(container).toBeInTheDocument();
  });
});
