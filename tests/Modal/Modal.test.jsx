import { render } from '@testing-library/react';

import Modal from '../../components/Modal/Modal';

describe('Modal', () => {
  it('renders without crashing', () => {
    const { container } = render(<Modal />);
    expect(container).toBeInTheDocument();
  });
});
