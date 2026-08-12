import { render } from '@testing-library/react';

import Overlay from '../../components/Overlay/Overlay';

describe('Overlay', () => {
  it('renders without crashing', () => {
    const { container } = render(<Overlay />);
    expect(container).toBeInTheDocument();
  });
});
