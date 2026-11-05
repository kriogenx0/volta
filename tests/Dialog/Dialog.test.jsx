import { render, screen, fireEvent } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';

import Dialog from '../../components/Dialog/Dialog';

const root = (container) => container.querySelector('.volta-dialog');

describe('Dialog', () => {
  it('renders without crashing', () => {
    const { container } = render(<Dialog />);
    expect(container).toBeInTheDocument();
  });

  describe('content', () => {
    it('is closed by default and open with isOpen', () => {
      const { container, rerender } = render(<Dialog title="Edit">Body</Dialog>);
      expect(root(container)).not.toHaveClass('pop_over-open');
      rerender(<Dialog isOpen title="Edit">Body</Dialog>);
      expect(root(container)).toHaveClass('pop_over-open');
    });

    it('shows the title, body, and Save and Cancel buttons', () => {
      render(<Dialog isOpen title="Edit profile">Body text</Dialog>);
      expect(screen.getByRole('heading', { name: 'Edit profile' })).toBeInTheDocument();
      expect(screen.getByText('Body text')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('is a dialog named by its title', () => {
      render(<Dialog isOpen title="Edit profile">Body</Dialog>);
      expect(screen.getByRole('dialog', { name: 'Edit profile' })).toBeInTheDocument();
    });

    it('applies its defaults under the automatic JSX runtime used by the Vite build', () => {
      // defaultProps are ignored on function components by that runtime
      render(jsx(Dialog, { isOpen: true, title: 'Edit', children: 'Body' }));
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('uses custom button labels', () => {
      render(<Dialog isOpen title="Remove" titleSave="Delete" titleCancel="Keep">Body</Dialog>);
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    });

    it('hides the header with hideHeader, or when there is no title', () => {
      const { rerender } = render(<Dialog isOpen hideHeader title="Edit">Body</Dialog>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      rerender(<Dialog isOpen>Body</Dialog>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
    });

    it('hides the Save button with hideSaveButton', () => {
      render(<Dialog isOpen title="About" hideSaveButton>Body</Dialog>);
      expect(screen.queryByRole('button', { name: 'Save Changes' })).not.toBeInTheDocument();
    });

    it('adds the inline-mode and custom classes', () => {
      const { container } = render(<Dialog isOpen inlineMode className="my-dialog">Body</Dialog>);
      expect(root(container)).toHaveClass('inline-mode', 'my-dialog');
    });
  });

  describe('Save', () => {
    it('calls handleSave and closes the dialog', () => {
      const handleSave = jest.fn();
      const { container } = render(<Dialog isOpen title="Edit" handleSave={handleSave}>Body</Dialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(root(container)).not.toHaveClass('pop_over-open');
    });

    it('is disabled, and does not save, when saveEnabled is false', () => {
      const handleSave = jest.fn();
      render(<Dialog isOpen title="Edit" saveEnabled={false} handleSave={handleSave}>Body</Dialog>);
      const save = screen.getByRole('button', { name: 'Save Changes' });
      expect(save).toBeDisabled();
      fireEvent.click(save);
      expect(handleSave).not.toHaveBeenCalled();
    });

    it('becomes enabled when saveEnabled turns true', () => {
      const { rerender } = render(<Dialog isOpen title="Edit" saveEnabled={false}>Body</Dialog>);
      rerender(<Dialog isOpen title="Edit" saveEnabled>Body</Dialog>);
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeEnabled();
    });

    it('closes without a handleSave', () => {
      const { container } = render(<Dialog isOpen title="Edit">Body</Dialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
      expect(root(container)).not.toHaveClass('pop_over-open');
    });
  });

  describe('closing', () => {
    it('calls handleClose and closes from Cancel', () => {
      const handleClose = jest.fn();
      const { container } = render(<Dialog isOpen title="Edit" handleClose={handleClose}>Body</Dialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(root(container)).not.toHaveClass('pop_over-open');
    });

    it('calls handleClose and closes from the header close button', () => {
      const handleClose = jest.fn();
      const { container } = render(<Dialog isOpen title="Edit" handleClose={handleClose}>Body</Dialog>);
      fireEvent.click(screen.getByLabelText('Close'));
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(root(container)).not.toHaveClass('pop_over-open');
    });

    it('stays open on a click outside by default', () => {
      const handleClose = jest.fn();
      const { container } = render(<Dialog isOpen title="Edit" handleClose={handleClose}>Body</Dialog>);
      fireEvent.click(root(container));
      expect(handleClose).not.toHaveBeenCalled();
      expect(root(container)).toHaveClass('pop_over-open');
    });

    it('closes itself and calls handleClose on a click outside with closeOnOverlayClick', () => {
      const handleClose = jest.fn();
      const { container } = render(<Dialog isOpen closeOnOverlayClick title="Edit" handleClose={handleClose}>Body</Dialog>);
      fireEvent.click(root(container));
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(root(container)).not.toHaveClass('pop_over-open');
    });

    it('closes on a click outside with closeOnOverlayClick even without a handleClose', () => {
      const { container } = render(<Dialog isOpen closeOnOverlayClick title="Edit">Body</Dialog>);
      fireEvent.click(root(container));
      expect(root(container)).not.toHaveClass('pop_over-open');
    });

    it('closes on Escape with closeOnOverlayClick', () => {
      const handleClose = jest.fn();
      const { container } = render(<Dialog isOpen closeOnOverlayClick title="Edit" handleClose={handleClose}>Body</Dialog>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(handleClose).toHaveBeenCalledTimes(1);
      expect(root(container)).not.toHaveClass('pop_over-open');
    });

    it('opens again when isOpen goes false and back to true', () => {
      const { container, rerender } = render(<Dialog isOpen title="Edit">Body</Dialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(root(container)).not.toHaveClass('pop_over-open');
      rerender(<Dialog isOpen={false} title="Edit">Body</Dialog>);
      rerender(<Dialog isOpen title="Edit">Body</Dialog>);
      expect(root(container)).toHaveClass('pop_over-open');
    });
  });
});
