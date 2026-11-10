import { render, screen, fireEvent } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';

import Dialog, { ModalDialog } from '../../components/Dialog/Dialog';

describe('ModalDialog', () => {
  it('renders without crashing', () => {
    const { container } = render(<ModalDialog />);
    expect(container).toBeInTheDocument();
  });

  describe('opening', () => {
    it('shows nothing until isOpen is true', () => {
      const { rerender } = render(<ModalDialog title="Confirm">Body</ModalDialog>);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
      rerender(<ModalDialog isOpen={false} title="Confirm">Body</ModalDialog>);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
      rerender(<ModalDialog isOpen title="Confirm">Body</ModalDialog>);
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('shows the title, body, and OK and Cancel buttons', () => {
      render(<ModalDialog isOpen title="Confirm">Apply changes?</ModalDialog>);
      expect(screen.getByRole('heading', { name: 'Confirm' })).toBeInTheDocument();
      expect(screen.getByText('Apply changes?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('applies its defaults under the automatic JSX runtime used by the Vite build', () => {
      // defaultProps are ignored on function components by that runtime
      render(jsx(ModalDialog, { isOpen: true, title: 'Confirm', children: 'Body' }));
      expect(screen.getByRole('button', { name: 'OK' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('uses custom button labels', () => {
      render(<ModalDialog isOpen okayButtonLabel="Create" cancelButtonLabel="Back">Body</ModalDialog>);
      expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });

    it('hides the header with hideHeader, or when there is no title', () => {
      const { rerender } = render(<ModalDialog isOpen hideHeader title="Confirm">Body</ModalDialog>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      rerender(<ModalDialog isOpen>Body</ModalDialog>);
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });

    it('hides the OK button with hideOkayButton', () => {
      render(<ModalDialog isOpen hideOkayButton>Body</ModalDialog>);
      expect(screen.queryByRole('button', { name: 'OK' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('adds the inline-mode and custom classes', () => {
      const { container } = render(<ModalDialog isOpen inlineMode className="my-dialog">Body</ModalDialog>);
      expect(container.firstChild).toHaveClass('volta-dialog', 'inline-mode', 'my-dialog');
    });
  });

  describe('OK', () => {
    it('calls onOkay and closes the dialog', () => {
      const onOkay = jest.fn();
      render(<ModalDialog isOpen onOkay={onOkay}>Body</ModalDialog>);
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      expect(onOkay).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('is disabled, and does nothing, when okayEnabled is false', () => {
      const onOkay = jest.fn();
      render(<ModalDialog isOpen okayEnabled={false} onOkay={onOkay}>Body</ModalDialog>);
      const ok = screen.getByRole('button', { name: 'OK' });
      expect(ok).toBeDisabled();
      fireEvent.click(ok);
      expect(onOkay).not.toHaveBeenCalled();
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('closes without an onOkay', () => {
      render(<ModalDialog isOpen>Body</ModalDialog>);
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });
  });

  describe('cancelling', () => {
    it('calls onCancel and closes from the Cancel button', () => {
      const onCancel = jest.fn();
      render(<ModalDialog isOpen onCancel={onCancel}>Body</ModalDialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('shows a close X only with closeX and a title, and it cancels', () => {
      const onCancel = jest.fn();
      const { rerender } = render(<ModalDialog isOpen title="Details" onCancel={onCancel}>Body</ModalDialog>);
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
      rerender(<ModalDialog isOpen closeX title="Details" onCancel={onCancel}>Body</ModalDialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('cancels on a click on the backdrop, but not inside the dialog', () => {
      const onCancel = jest.fn();
      const { container } = render(<ModalDialog isOpen onCancel={onCancel}>Body</ModalDialog>);
      fireEvent.click(screen.getByText('Body'));
      expect(onCancel).not.toHaveBeenCalled();
      fireEvent.click(container.firstChild);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('cancels on Escape', () => {
      const onCancel = jest.fn();
      render(<ModalDialog isOpen onCancel={onCancel}>Body</ModalDialog>);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
    });

    it('ignores the backdrop and Escape with closeOnOverlayClick off', () => {
      const onCancel = jest.fn();
      const { container } = render(<ModalDialog isOpen closeOnOverlayClick={false} onCancel={onCancel}>Body</ModalDialog>);
      fireEvent.click(container.firstChild);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).not.toHaveBeenCalled();
      expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('opens again when isOpen goes false and back to true', () => {
      const { rerender } = render(<ModalDialog isOpen>Body</ModalDialog>);
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('Body')).not.toBeInTheDocument();
      rerender(<ModalDialog isOpen={false}>Body</ModalDialog>);
      rerender(<ModalDialog isOpen>Body</ModalDialog>);
      expect(screen.getByText('Body')).toBeInTheDocument();
    });
  });
});

describe('ModalDialog is a Dialog under older names', () => {
  it('is built on the Dialog, with OK and Cancel for Save and Cancel', () => {
    const { container } = render(<ModalDialog isOpen title="Confirm">Body</ModalDialog>);
    expect(container.firstChild).toHaveClass('volta-dialog', 'volta-modal');
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('save-button');
    expect(screen.getByRole('dialog', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('closes on a click outside by default, where a Dialog does not', () => {
    const onCancel = jest.fn();
    const handleClose = jest.fn();
    const first = render(<ModalDialog isOpen onCancel={onCancel}>Body</ModalDialog>);
    fireEvent.click(first.container.firstChild);
    expect(onCancel).toHaveBeenCalledTimes(1);
    const second = render(<Dialog isOpen handleClose={handleClose}>Body</Dialog>);
    fireEvent.click(second.container.firstChild);
    expect(handleClose).not.toHaveBeenCalled();
  });
});
