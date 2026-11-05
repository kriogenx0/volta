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

  describe('standalone form (title or onClose)', () => {
    it('is a dialog named by its title', () => {
      render(<Modal title="Delete item" onClose={() => {}}>Body</Modal>);
      expect(screen.getByRole('dialog', { name: 'Delete item' })).toBeInTheDocument();
    });

    it('is open unless show is false', () => {
      const { rerender } = render(<Modal title="Hi" onClose={() => {}}>Body</Modal>);
      expect(screen.getByText('Body')).toBeInTheDocument();
      rerender(<Modal show title="Hi" onClose={() => {}}>Body</Modal>);
      expect(screen.getByText('Body')).toBeInTheDocument();
      rerender(<Modal show={false} title="Hi" onClose={() => {}}>Body</Modal>);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('calls onClose on Escape while open', () => {
      const onClose = jest.fn();
      const { rerender } = render(<Modal title="Hi" onClose={onClose}>Body</Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
      rerender(<Modal show={false} title="Hi" onClose={onClose}>Body</Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('shows a title without an onClose, and does not throw on Escape', () => {
      render(<Modal title="Info">Body</Modal>);
      expect(screen.getByRole('heading', { name: 'Info' })).toBeInTheDocument();
      expect(() => fireEvent.keyDown(document, { key: 'Escape' })).not.toThrow();
    });

    it('adds a custom className to the panel', () => {
      render(<Modal title="Hi" onClose={() => {}} className="wide">Body</Modal>);
      expect(screen.getByRole('dialog')).toHaveClass('volta-modal-panel', 'wide');
    });
  });

  describe('container form (show and onHide)', () => {
    it('renders nothing unless show is true', () => {
      const { container, rerender } = render(<Modal headerTitle="Heading">Body</Modal>);
      expect(container).toBeEmptyDOMElement();
      rerender(<Modal show={false} headerTitle="Heading">Body</Modal>);
      expect(container).toBeEmptyDOMElement();
      rerender(<Modal show headerTitle="Heading">Body</Modal>);
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('shows its children and heading in a dialog panel', () => {
      render(<Modal show headerTitle="Heading">Body</Modal>);
      const panel = screen.getByRole('dialog', { name: 'Heading' });
      expect(panel).toHaveTextContent('Heading');
      expect(panel).toHaveTextContent('Body');
      expect(panel).toHaveClass('modal-dialog');
    });

    it('works without a heading', () => {
      render(<Modal show>Body</Modal>);
      expect(screen.getByText('Body')).toBeInTheDocument();
      expect(document.querySelector('.modal-header')).not.toBeInTheDocument();
    });

    it('adds a custom className to the backdrop', () => {
      const { container } = render(<Modal show className="my-modal">Body</Modal>);
      expect(container.firstChild).toHaveClass('volta-modal', 'my-modal');
    });

    it('calls onHide when the backdrop is clicked, but not the panel', () => {
      const onHide = jest.fn();
      const { container } = render(<Modal show onHide={onHide}>Body</Modal>);
      fireEvent.click(screen.getByText('Body'));
      expect(onHide).not.toHaveBeenCalled();
      fireEvent.click(container.firstChild);
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('calls onHide on Escape while shown', () => {
      const onHide = jest.fn();
      const { rerender } = render(<Modal onHide={onHide}>Body</Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).not.toHaveBeenCalled();
      rerender(<Modal show onHide={onHide}>Body</Modal>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onHide).toHaveBeenCalledTimes(1);
    });

    it('does not throw when dismissed without an onHide', () => {
      const { container } = render(<Modal show>Body</Modal>);
      expect(() => {
        fireEvent.click(container.firstChild);
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });

    it('does not pass show or onHide on to the DOM', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { container } = render(<Modal show onHide={() => {}}>Body</Modal>);
      expect(container.firstChild).not.toHaveAttribute('show');
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });

    it('passes other props on to the backdrop', () => {
      const { container } = render(<Modal show data-testid="backdrop">Body</Modal>);
      expect(container.firstChild).toHaveAttribute('data-testid', 'backdrop');
    });

    it('pads content wrapped in Modal.inside', () => {
      render(<Modal show><Modal.inside>Padded</Modal.inside></Modal>);
      expect(screen.getByText('Padded')).toHaveClass('modal-inside--padding');
    });
  });
});
