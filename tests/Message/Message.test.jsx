import { render } from '@testing-library/react';

import Message from '../../components/Message/Message';

describe('Message', () => {
  it('renders without crashing', () => {
    const { container } = render(<Message type="success" message="Saved" />);
    expect(container).toBeInTheDocument();
  });
});
