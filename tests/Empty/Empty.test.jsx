import { render } from '@testing-library/react';

import Empty from '../../components/Empty/Empty';

describe('Empty', () => {
  it('renders without crashing', () => {
    const { container } = render(<Empty />);
    expect(container).toBeInTheDocument();
  });
});
