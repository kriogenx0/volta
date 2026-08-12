import { render } from '@testing-library/react';

import PageWidth from '../../components/PageWidth/PageWidth';

describe('PageWidth', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageWidth />);
    expect(container).toBeInTheDocument();
  });
});
