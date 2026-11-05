import { render, screen, fireEvent } from '@testing-library/react';

import Textarea from '../../components/Textarea/Textarea';

describe('Textarea', () => {
  it('renders without crashing', () => {
    const { container } = render(<Textarea />);
    expect(container).toBeInTheDocument();
  });

  it('renders a textarea inside the c-textarea wrapper', () => {
    const { container } = render(<Textarea placeholder="Write" rows={4} />);
    const textarea = screen.getByPlaceholderText('Write');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
    expect(container.firstChild).toHaveClass('volta-textfield', 'textfield-multiline', 'c-textarea');
  });

  it('is controlled by value and reports changes', () => {
    const onChange = jest.fn();
    const { rerender } = render(<Textarea value="one" onChange={onChange} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('one');
    fireEvent.change(textarea, { target: { value: 'two' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    rerender(<Textarea value="two" onChange={onChange} />);
    expect(textarea).toHaveValue('two');
  });

  describe('resize', () => {
    it('can be resized both ways by default', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toHaveClass('resize-both');
    });

    it.each([
      ['y', 'resize-y'],
      ['none', 'resize-none'],
      ['both', 'resize-both']
    ])('maps resize="%s" to %s', (resize, className) => {
      render(<Textarea resize={resize} />);
      expect(screen.getByRole('textbox')).toHaveClass(className);
    });

    it('keeps a custom className next to the resize class', () => {
      render(<Textarea resize="y" className="mine" />);
      expect(screen.getByRole('textbox')).toHaveClass('resize-y', 'mine');
    });
  });

  describe('height', () => {
    it('sets the height on the textarea itself', () => {
      render(<Textarea height={160} />);
      expect(screen.getByRole('textbox')).toHaveStyle({ height: '160px' });
    });

    it('accepts a CSS length and keeps other styles', () => {
      render(<Textarea height="10em" style={{ width: '50%' }} />);
      expect(screen.getByRole('textbox')).toHaveStyle({ height: '10em', width: '50%' });
    });

    it('leaves the height alone when not given', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox').style.height).toBe('');
    });
  });

  describe('TextField props', () => {
    it('labels the field and marks it optional', () => {
      render(<Textarea label="Bio" optional />);
      expect(screen.getByLabelText(/Bio/)).toBe(screen.getByRole('textbox'));
      expect(screen.getByText('(optional)')).toBeInTheDocument();
    });

    it('disables the textarea', () => {
      render(<Textarea disabled aria-label="Notes" />);
      expect(screen.getByRole('textbox', { name: 'Notes' })).toBeDisabled();
    });

    it('shows an error message and marks the textarea invalid', () => {
      render(<Textarea label="Reason" error="A reason is required" />);
      expect(screen.getByText('A reason is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Reason')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
