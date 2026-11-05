import { render, screen, fireEvent } from '@testing-library/react';

import TextField, { TextBox } from '../../components/TextField/TextField';
import * as barrel from '../../components';

describe('TextField', () => {
  it('renders without crashing', () => {
    const { container } = render(<TextField />);
    expect(container).toBeInTheDocument();
  });

  it('labels the input and marks optional fields', () => {
    render(<TextField label="Name" optional />);
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByText('(optional)')).toBeInTheDocument();
  });

  it('defaults to the small size and accepts the medium one', () => {
    const { container, rerender } = render(<TextField />);
    expect(container.firstChild).toHaveClass('volta-textfield--sm');
    rerender(<TextField fieldSize="md" />);
    expect(container.firstChild).toHaveClass('volta-textfield--md');
  });

  it('renders a textarea when multiline and passes className to the control', () => {
    render(<TextField multiline className="custom" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
    expect(screen.getByRole('textbox').tagName).toBe('TEXTAREA');
  });

  it('passes input props through and types into the native input', () => {
    const onChange = jest.fn();
    render(<TextField placeholder="Enter stuff" type="email" onChange={onChange} />);
    const input = screen.getByPlaceholderText('Enter stuff');
    expect(input).toHaveAttribute('type', 'email');
    fireEvent.change(input, { target: { value: 'a@b.co' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('a@b.co');
  });

  it('disables the control and marks the wrapper', () => {
    const { container } = render(<TextField disabled defaultValue="locked" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(container.firstChild).toHaveClass('textfield-disabled');
  });

  it('calls validate with the current text on key up', () => {
    const validate = jest.fn();
    render(<TextField validate={validate} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.keyUp(input);
    expect(validate).toHaveBeenCalledWith('abc');
  });

  it('keeps a plain onKeyUp when there is no validate', () => {
    const onKeyUp = jest.fn();
    render(<TextField onKeyUp={onKeyUp} />);
    fireEvent.keyUp(screen.getByRole('textbox'));
    expect(onKeyUp).toHaveBeenCalledTimes(1);
  });

  describe('error', () => {
    it('shows the message, marks the control invalid and describes it with the message', () => {
      const { container } = render(<TextField label="Username" error="Too short" />);
      const input = screen.getByLabelText('Username');
      expect(screen.getByText('Too short')).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAccessibleDescription('Too short');
      expect(container.querySelector('.volta-textfield')).toHaveClass('textfield-error');
    });

    it('works without a label and keeps a caller aria-describedby', () => {
      render(<><p id="hint">Pick one</p><TextField aria-label="Handle" aria-describedby="hint" error="Taken" /></>);
      expect(screen.getByRole('textbox', { name: 'Handle' })).toHaveAccessibleDescription('Pick one Taken');
    });

    it('is not marked invalid and shows no message without an error', () => {
      const { container } = render(<TextField label="Username" />);
      expect(screen.getByLabelText('Username')).not.toHaveAttribute('aria-invalid');
      expect(container.querySelector('.volta-error_text')).toBeNull();
      expect(container.querySelector('.textfield-error')).toBeNull();
    });

    it('marks a multiline field invalid too', () => {
      render(<TextField multiline aria-label="Notes" error="Required" />);
      expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('TextBox alias', () => {
    it('renders a TextField with the c-text_box compat class', () => {
      const { container } = render(<TextBox placeholder="Same" />);
      expect(container.querySelector('.c-text_box')).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('volta-textfield', 'volta-textfield--sm');
      expect(screen.getByPlaceholderText('Same')).toBeInTheDocument();
    });

    it('accepts every TextField prop, including its own wrapperClassName', () => {
      const { container } = render(<TextBox label="Name" fieldSize="md" wrapperClassName="mine" />);
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(container.querySelector('.volta-textfield--md')).toBeInTheDocument();
      expect(container.querySelector('.mine')).toBeInTheDocument();
    });

    it('is still exported from the library entry point', () => {
      expect(barrel.TextBox).toBe(TextBox);
      expect(barrel.TextField).toBe(TextField);
    });
  });
});
