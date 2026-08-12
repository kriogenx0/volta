import { render } from '@testing-library/react';

import Drawer from '../../components/Drawer/Drawer';

describe('Drawer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Drawer />);
    expect(container).toBeInTheDocument();
  });
});
