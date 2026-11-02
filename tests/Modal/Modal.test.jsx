import { render, screen, fireEvent } from '@testing-library/react';

import Modal from '../../components/Modal/Modal';

describe('Modal', () => {
  it('renders without crashing', () => {
    const { container } = render(<Modal />);
    expect(container).toBeInTheDocument();
  });

  it('renders a titled standalone modal', () => {
    render(<Modal title="Delete item" onClose={() => {}}>Are you sure?</Modal>);
    expect(screen.getByRole('heading', { name: 'Delete item' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure?').closest('.volta-modal-panel')).toBeInTheDocument();
  });

  it('closes from the close button and the backdrop, but not from the panel', () => {
    const onClose = jest.fn();
    const { container } = render(<Modal title="Hi" onClose={onClose}>Body</Modal>);
    fireEvent.click(screen.getByText('Body'));
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector('.volta-modal--standalone'));
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
