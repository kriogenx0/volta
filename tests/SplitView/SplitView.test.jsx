import { render } from '@testing-library/react';

import SplitView from '../../components/SplitView/SplitView';

describe('SplitView', () => {
  it('renders without crashing', () => {
    const { container } = render(<SplitView />);
    expect(container).toBeInTheDocument();
  });
});
