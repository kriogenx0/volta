import { render } from '@testing-library/react';

import MapSelector from '../../components/MapSelector/MapSelector';

describe('MapSelector', () => {
  it('renders without crashing', () => {
    const { container } = render(<MapSelector />);
    expect(container).toBeInTheDocument();
  });
});
