import { render } from '@testing-library/react';

import TabBar from '../../components/TabBar/TabBar';

describe('TabBar', () => {
  it('renders without crashing', () => {
    const { container } = render(<TabBar />);
    expect(container).toBeInTheDocument();
  });
});
