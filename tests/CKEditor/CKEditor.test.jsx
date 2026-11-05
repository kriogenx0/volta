import { render, screen, fireEvent, act } from '@testing-library/react';

import CKEditor from '../../components/CKEditor/CKEditor';

describe('CKEditor', () => {
  afterEach(() => {
    delete window.CKEDITOR;
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<CKEditor />);
    expect(container).toBeInTheDocument();
  });

  it('shows the placeholder, not "undefined", when it has no value', () => {
    render(<CKEditor />);
    const field = screen.getByRole('button');
    expect(field).toHaveTextContent('Click to edit');
    expect(field).toHaveClass('volta-ckeditor--empty');
  });

  it('shows a custom placeholder', () => {
    render(<CKEditor placeholder="Add notes" />);
    expect(screen.getByRole('button', { name: 'Add notes' })).toBeInTheDocument();
  });

  it('shows the unescaped value', () => {
    render(<CKEditor fieldValue="Fish%20%26%20chips" />);
    const field = screen.getByRole('button', { name: 'Fish & chips' });
    expect(field).not.toHaveClass('volta-ckeditor--empty');
  });

  describe('without the CKEDITOR global', () => {
    it('edits in a focused textarea named for the field when clicked, or on Enter', () => {
      const { unmount } = render(<CKEditor fieldName="summary" fieldValue="Hello%20there" />);
      fireEvent.click(screen.getByRole('button'));
      const textarea = screen.getByRole('textbox', { name: 'summary' });
      expect(textarea).toHaveValue('Hello there');
      expect(textarea).toHaveAttribute('name', 'summary');
      expect(textarea).toHaveFocus();
      unmount();

      render(<CKEditor fieldValue="Hello" />);
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('saves what was typed when the textarea loses focus', () => {
      render(<CKEditor fieldValue="Hello" />);
      fireEvent.click(screen.getByRole('button'));
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Goodbye & thanks' } });
      fireEvent.blur(screen.getByRole('textbox'));

      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.getByRole('button', { name: 'Goodbye & thanks' })).toBeInTheDocument();
    });
  });

  describe('with CKEditor on the page', () => {
    const installFake = () => {
      const editor = {
        handlers: {},
        on: jest.fn((event, handler) => { editor.handlers[event] = handler; }),
        getData: jest.fn(() => '<p>New & improved</p>'),
        destroy: jest.fn()
      };
      window.CKEDITOR = {
        instances: { summary: editor },
        replace: jest.fn()
      };
      return editor;
    };

    it('replaces the textarea named for the field with an editor', () => {
      jest.useFakeTimers();
      installFake();
      render(<CKEditor fieldName="summary" fieldValue="Hello" />);
      fireEvent.click(screen.getByRole('button'));
      expect(window.CKEDITOR.replace).not.toHaveBeenCalled();

      act(() => { jest.advanceTimersByTime(100); });
      expect(window.CKEDITOR.replace).toHaveBeenCalledTimes(1);
      expect(window.CKEDITOR.replace).toHaveBeenCalledWith('summary', expect.objectContaining({ toolbar: 'Basic' }));
    });

    it('does not create another editor when the field renders again while editing', () => {
      jest.useFakeTimers();
      installFake();
      const { rerender } = render(<CKEditor fieldName="summary" fieldValue="Hello" />);
      fireEvent.click(screen.getByRole('button'));
      rerender(<CKEditor fieldName="summary" fieldValue="Hello" />);
      act(() => { jest.advanceTimersByTime(500); });
      expect(window.CKEDITOR.replace).toHaveBeenCalledTimes(1);
    });

    it('saves the editor data and destroys the editor when it loses focus', () => {
      jest.useFakeTimers();
      const editor = installFake();
      render(<CKEditor fieldName="summary" fieldValue="Hello" />);
      fireEvent.click(screen.getByRole('button'));
      act(() => { jest.advanceTimersByTime(100); });

      act(() => { editor.handlers.blur(); });
      expect(editor.destroy).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(screen.getByRole('button')).toHaveTextContent('<p>New & improved</p>');
    });

    it('destroys the editor if the field is removed while editing', () => {
      jest.useFakeTimers();
      const editor = installFake();
      const { unmount } = render(<CKEditor fieldName="summary" fieldValue="Hello" />);
      fireEvent.click(screen.getByRole('button'));
      act(() => { jest.advanceTimersByTime(100); });
      unmount();
      expect(editor.destroy).toHaveBeenCalledTimes(1);
    });

    it('does not create an editor if it is removed before it starts', () => {
      jest.useFakeTimers();
      installFake();
      const { unmount } = render(<CKEditor fieldName="summary" fieldValue="Hello" />);
      fireEvent.click(screen.getByRole('button'));
      unmount();
      act(() => { jest.advanceTimersByTime(500); });
      expect(window.CKEDITOR.replace).not.toHaveBeenCalled();
    });
  });
});
