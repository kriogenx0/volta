import { render } from '@testing-library/react';

import SegmentedControl from '../../components/SegmentedControl/SegmentedControl';

describe('SegmentedControl', () => {
  it('renders without crashing', () => {
    const { container } = render(<SegmentedControl />);
    expect(container).toBeInTheDocument();
  });
});
