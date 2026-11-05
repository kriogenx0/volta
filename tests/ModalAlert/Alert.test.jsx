import { render, screen, fireEvent } from '@testing-library/react';
import { jsx } from 'react/jsx-runtime';

import Alert from '../../components/ModalAlert';

describe('Alert', () => {
  it('renders without crashing', () => {
    const { container } = render(<Alert />);
    expect(container).toBeInTheDocument();
  });

  describe('content', () => {
    it('shows the title, message and the default button labels', () => {
      render(<Alert title="Delete file?" message="This can't be undone." />);
      expect(screen.getByRole('heading', { name: 'Delete file?' })).toBeInTheDocument();
      expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('applies its defaults under the automatic JSX runtime used by the Vite build', () => {
      // defaultProps are ignored on function components by that runtime
      render(jsx(Alert, { title: 'Hi' }));
      expect(screen.getByText('Confirm')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(() => {
        fireEvent.click(screen.getByText('Confirm'));
        fireEvent.click(screen.getByText('Cancel'));
        fireEvent.keyDown(document, { key: 'Escape' });
      }).not.toThrow();
    });

    it('uses custom button labels', () => {
      render(<Alert title="Leave?" confirmTitle="Leave" cancelTitle="Stay" />);
      expect(screen.getByText('Leave')).toBeInTheDocument();
      expect(screen.getByText('Stay')).toBeInTheDocument();
    });

    it('leaves out the message paragraph when there is no message', () => {
      const { container } = render(<Alert title="Heads up" />);
      expect(container.querySelector('.lrt_message')).not.toBeInTheDocument();
    });

    it('is an alert dialog named by its title and described by its message', () => {
      render(<Alert title="Delete file?" message="This can't be undone." />);
      const dialog = screen.getByRole('alertdialog', { name: 'Delete file?' });
      expect(dialog).toHaveAccessibleDescription("This can't be undone.");
    });

    it('has no text field by default', () => {
      render(<Alert title="Hi" />);
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  describe('buttons', () => {
    it('calls onConfirm with null for a text alert', () => {
      const onConfirm = jest.fn();
      render(<Alert title="Hi" onConfirm={onConfirm} />);
      fireEvent.click(screen.getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onConfirm).toHaveBeenCalledWith(null);
    });

    it('calls onCancel from the cancel button', () => {
      const onCancel = jest.fn();
      const onConfirm = jest.fn();
      render(<Alert title="Hi" onCancel={onCancel} onConfirm={onConfirm} />);
      fireEvent.click(screen.getByText('Cancel'));
      expect(onCancel).toHaveBeenCalledTimes(1);
      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('input type', () => {
    it('shows a text field named by the message, and focuses it', () => {
      render(<Alert type="input" title="Rename" message="Enter a new name." />);
      const input = screen.getByRole('textbox', { name: 'Enter a new name.' });
      expect(input).toHaveFocus();
    });

    it('names the text field by the title when there is no message', () => {
      render(<Alert type="input" title="Rename" />);
      expect(screen.getByRole('textbox', { name: 'Rename' })).toBeInTheDocument();
    });

    it('passes the typed text to onConfirm', () => {
      const onConfirm = jest.fn();
      render(<Alert type="input" title="Rename" onConfirm={onConfirm} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'report.pdf' } });
      fireEvent.click(screen.getByText('Confirm'));
      expect(onConfirm).toHaveBeenCalledWith('report.pdf');
    });
  });

  describe('keyboard', () => {
    it('cancels on Escape', () => {
      const onCancel = jest.fn();
      render(<Alert title="Hi" onCancel={onCancel} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('confirms on Enter', () => {
      const onConfirm = jest.fn();
      render(<Alert title="Hi" onConfirm={onConfirm} />);
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('confirms with the typed text on Enter in the text field', () => {
      const onConfirm = jest.fn();
      render(<Alert type="input" title="Rename" onConfirm={onConfirm} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'notes' } });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(onConfirm).toHaveBeenCalledWith('notes');
    });

    it('does not confirm twice when Enter is pressed on a button', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      render(<Alert title="Hi" onConfirm={onConfirm} onCancel={onCancel} />);
      // Enter on a focused button is handled by its own click, not by the key listener
      fireEvent.keyDown(screen.getByText('Cancel'), { key: 'Enter' });
      expect(onConfirm).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('ignores a held-down key', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();
      render(<Alert title="Hi" onConfirm={onConfirm} onCancel={onCancel} />);
      fireEvent.keyDown(document, { key: 'Enter', repeat: true });
      fireEvent.keyDown(document, { key: 'Escape', repeat: true });
      expect(onConfirm).not.toHaveBeenCalled();
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('does not act on the key release that opened it', () => {
      const onConfirm = jest.fn();
      render(<Alert title="Hi" onConfirm={onConfirm} />);
      fireEvent.keyUp(document, { key: 'Enter' });
      expect(onConfirm).not.toHaveBeenCalled();
    });

    it('calls the latest callbacks after a re-render', () => {
      const first = jest.fn();
      const second = jest.fn();
      const { rerender } = render(<Alert title="Hi" onCancel={first} />);
      rerender(<Alert title="Hi" onCancel={second} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });

    it('stops listening once unmounted', () => {
      const onCancel = jest.fn();
      const { unmount } = render(<Alert title="Hi" onCancel={onCancel} />);
      unmount();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onCancel).not.toHaveBeenCalled();
    });
  });
});
