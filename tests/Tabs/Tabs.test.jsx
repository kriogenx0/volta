import { render } from '@testing-library/react';

import Tabs from '../../components/Tabs/Tabs';

describe('Tabs', () => {
  it('renders without crashing', () => {
    const { container } = render(<Tabs />);
    expect(container).toBeInTheDocument();
  });
});
