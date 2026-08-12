import { render } from '@testing-library/react';

import TabsRouted from '../../components/TabsRouted/TabsRouted';

describe('TabsRouted', () => {
  it('renders without crashing', () => {
    const { container } = render(<TabsRouted />);
    expect(container).toBeInTheDocument();
  });
});
