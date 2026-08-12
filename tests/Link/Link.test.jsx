import { render } from '@testing-library/react';

import Link from '../../components/Link/Link';

describe('Link', () => {
  it('renders without crashing', () => {
    const { container } = render(<Link />);
    expect(container).toBeInTheDocument();
  });
});
