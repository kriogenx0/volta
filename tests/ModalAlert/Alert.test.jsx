import { render } from '@testing-library/react';

import Alert from '../../components/ModalAlert';

describe('Alert', () => {
  it('renders without crashing', () => {
    const { container } = render(<Alert />);
    expect(container).toBeInTheDocument();
  });
});
