import { fireEvent, render, screen } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';

import Modal, { PopOver } from '../../components/Modal/Modal';
import * as library from '../../components';

// What PopOver was: open, handleClose, fullSize and closeOnOverlayClick on Modal
describe('Modal with the PopOver names', () => {
  it('PopOver is Modal itself, in the module and the library', () => {
    expect(PopOver).toBe(Modal);
    expect(library.PopOver).toBe(library.Modal);
  });

  it('shows its children while open, and nothing while closed', () => {
    const { rerender } = render(<Modal open>Content</Modal>);
    expect(screen.getByText('Content')).toBeInTheDocument();
    rerender(<Modal open={false}>Content</Modal>);
    expect(screen.queryByText('Content')).toBeNull();
  });

  it('open wins over show', () => {
    render(<Modal open={false} show>Content</Modal>);
    expect(screen.queryByText('Content')).toBeNull();
  });

  it('calls handleClose when the backdrop is clicked, but not when the content is', () => {
    const handleClose = jest.fn();
    const { container } = render(<Modal open handleClose={handleClose}>Content</Modal>);
    fireEvent.click(screen.getByText('Content'));
    expect(handleClose).not.toHaveBeenCalled();
    fireEvent.click(document.querySelector('.volta-overlay'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose on Escape while open, and not while closed', () => {
    const handleClose = jest.fn();
    const { rerender } = render(<Modal open handleClose={handleClose}>Content</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
    rerender(<Modal open={false} handleClose={handleClose}>Content</Modal>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('ignores a click outside and Escape with closeOnOverlayClick off', () => {
    const handleClose = jest.fn();
    const { container } = render(<Modal open closeOnOverlayClick={false} handleClose={handleClose}>Content</Modal>);
    fireEvent.click(document.querySelector('.volta-overlay'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).not.toHaveBeenCalled();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does the same for a titled modal with closeOnOverlayClick off, but its X still closes', () => {
    const onClose = jest.fn();
    const { container } = render(<Modal title="Titled" closeOnOverlayClick={false} onClose={onClose}>Content</Modal>);
    fireEvent.click(document.querySelector('.volta-overlay'));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not throw without a handler', () => {
    const { container } = render(<Modal open>Content</Modal>);
    expect(() => {
      fireEvent.click(document.querySelector('.volta-overlay'));
      fireEvent.keyDown(document, { key: 'Escape' });
    }).not.toThrow();
  });

  it('is a dialog named by aria-label or aria-labelledby', () => {
    const { rerender } = render(<Modal open aria-label="Settings">Content</Modal>);
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    rerender(<div><h2 id="t">Heading</h2><Modal open aria-labelledby="t">Content</Modal></div>);
    expect(screen.getByRole('dialog', { name: 'Heading' })).toBeInTheDocument();
  });

  it('can be told its role, and what describes it', () => {
    render(<Modal open role="alertdialog" aria-describedby="why" aria-label="Sure?"><p id="why">Because</p></Modal>);
    const panel = screen.getByRole('alertdialog', { name: 'Sure?' });
    expect(panel).toHaveAccessibleDescription('Because');
  });

  it('adds a custom className to the backdrop', () => {
    const { container } = render(<Modal open className="mine">Content</Modal>);
    expect(container.firstChild).toHaveClass('volta-modal', 'mine');
  });

  it('applies its defaults under the automatic JSX runtime used by the Vite build', () => {
    const { container } = render(jsx(Modal, { open: true, children: 'Content' }));
    expect(container.firstChild).not.toHaveClass('volta-modal--inline');
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  describe('in place (fullSize off)', () => {
    it('keeps the panel in the page over a click-catcher, and is not modal', () => {
      const { container } = render(<Modal open fullSize={false}>Content</Modal>);
      expect(container.firstChild).toHaveClass('volta-modal', 'volta-modal--inline');
      expect(container.querySelector('.volta-modal-catcher')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
    });

    it('closes from the click-catcher, but not from the content, and ignores a click on the root', () => {
      const handleClose = jest.fn();
      const { container } = render(<Modal open fullSize={false} handleClose={handleClose}>Content</Modal>);
      fireEvent.click(screen.getByText('Content'));
      fireEvent.click(container.firstChild);
      expect(handleClose).not.toHaveBeenCalled();
      fireEvent.click(container.querySelector('.volta-modal-catcher'));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('does not throw when the click-catcher is clicked without a handler', () => {
      const { container } = render(<Modal open fullSize={false}>Content</Modal>);
      expect(() => fireEvent.click(container.querySelector('.volta-modal-catcher'))).not.toThrow();
    });

    it('can be made modal on request', () => {
      render(<Modal open fullSize={false} modal>Content</Modal>);
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });
  });
});
