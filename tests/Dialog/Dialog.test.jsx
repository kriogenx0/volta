import { render } from '@testing-library/react';

import Dialog from '../../components/Dialog/Dialog';

describe('Dialog', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dialog />);
    expect(container).toBeInTheDocument();
  });
});
