import { render } from '@testing-library/react';

import Map from '../../components/Map/Map';

describe('Map', () => {
  it('renders without crashing', () => {
    const { container } = render(<Map />);
    expect(container).toBeInTheDocument();
  });
});
