import { useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { render, screen, fireEvent } from '@testing-library/react';

import NumericField from '../../components/NumericField/NumericField';

const field = () => screen.getByRole('spinbutton');
const type = (value) => fireEvent.change(field(), { target: { value } });

describe('NumericField', () => {
  it('renders without crashing', () => {
    const { container } = render(<NumericField />);
    expect(container).toBeInTheDocument();
  });

  it('uses a native number input and passes through its constraints', () => {
    render(<NumericField aria-label="Quantity" type="text" min={1} max={10} step={1} />);

    const input = screen.getByRole('spinbutton', { name: 'Quantity' });
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '1');
    expect(input).toHaveAttribute('max', '10');
    expect(input).toHaveAttribute('step', '1');
  });

  it('can be disabled', () => {
    render(<NumericField aria-label="Seats" value={24} disabled />);
    expect(field()).toBeDisabled();
    expect(field()).toHaveValue(24);
  });

  describe('formatting', () => {
    it('shows whole numbers by default', () => {
      render(<NumericField value={7.8} />);
      expect(field()).toHaveValue(8);
    });

    it('formats to two decimals with onBlurFormat="twoDecimal"', () => {
      render(<NumericField value={12.5} onBlurFormat="twoDecimal" />);
      expect(field().value).toBe('12.50');
    });

    it('accepts a numeral format string', () => {
      render(<NumericField value={3.14159} onBlurFormat="0.0" />);
      expect(field().value).toBe('3.1');
    });

    it('accepts a format function, and the deprecated format alias', () => {
      const { rerender } = render(<NumericField value={4} onBlurFormat={(v) => `${v}.5`} />);
      expect(field().value).toBe('4.5');
      rerender(<NumericField value={4} format="twoDecimal" />);
      expect(field().value).toBe('4.00');
    });

    it('formats the typed value when the field loses focus', () => {
      const onBlur = jest.fn();
      render(<NumericField value={1} onBlurFormat="twoDecimal" onBlur={onBlur} />);
      type('3.14159');
      expect(field().value).toBe('3.14159');
      fireEvent.blur(field());
      expect(field().value).toBe('3.14');
      expect(onBlur).toHaveBeenCalledWith('3.14');
    });

    it('follows a new value prop', () => {
      const { rerender } = render(<NumericField value={1} />);
      rerender(<NumericField value={9} />);
      expect(field()).toHaveValue(9);
    });
  });

  describe('typing', () => {
    it('reports each change through onChange', () => {
      const onChange = jest.fn();
      render(<NumericField value={1} onChange={onChange} />);
      type('12');
      expect(onChange).toHaveBeenLastCalledWith('12');
      expect(field()).toHaveValue(12);
    });

    it('rejects input the whenTypingFormat function turns down', () => {
      const onChange = jest.fn();
      const upToThreeDigits = (value) => (/^\d{0,3}$/.test(value) ? value : null);
      render(<NumericField value={42} whenTypingFormat={upToThreeDigits} onChange={onChange} />);
      type('1234');
      expect(onChange).not.toHaveBeenCalled();
      expect(field()).toHaveValue(42);
      type('123');
      expect(onChange).toHaveBeenCalledWith('123');
    });

    it('blocks characters that are not part of a number by default', () => {
      const onChange = jest.fn();
      render(<NumericField value={5} onChange={onChange} />);
      type('1e5');
      expect(onChange).not.toHaveBeenCalled();
      expect(field()).toHaveValue(5);
    });

    it('lets the value be cleared while typing', () => {
      const onChange = jest.fn();
      render(<NumericField value={5} onChange={onChange} />);
      type('');
      expect(onChange).toHaveBeenCalledWith('');
    });
  });

  describe('focus and blur callbacks', () => {
    it('calls onFocus with the current value', () => {
      const onFocus = jest.fn();
      render(<NumericField value={6} onFocus={onFocus} />);
      fireEvent.focus(field());
      expect(onFocus).toHaveBeenCalledWith('6', null);
    });

    it('replaces the value with focusValue the first time it is focused', () => {
      render(<NumericField value={6} focusValue="" />);
      fireEvent.focus(field());
      expect(field()).toHaveValue(null);
    });

    it('calls onBlurChange with the new and previous value only when it changed', () => {
      const onBlurChange = jest.fn();
      render(<NumericField value={6} onBlurChange={onBlurChange} />);

      fireEvent.focus(field());
      fireEvent.blur(field());
      expect(onBlurChange).not.toHaveBeenCalled();

      type('9');
      fireEvent.blur(field());
      expect(onBlurChange).toHaveBeenCalledTimes(1);
      expect(onBlurChange).toHaveBeenCalledWith('9', '6');
    });

    it('does not make the input uncontrolled when focused', () => {
      const error = jest.spyOn(console, 'error').mockImplementation(() => {});
      render(<NumericField value={6} />);
      fireEvent.focus(field());
      type('7');
      fireEvent.blur(field());
      expect(error).not.toHaveBeenCalled();
      error.mockRestore();
    });
  });

  it('keeps a value held in state in step through onBlurChange', () => {
    const Price = () => {
      const [price, setPrice] = useState(19.5);
      return (
        <>
          <NumericField aria-label="Price" value={price} onBlurFormat="twoDecimal" onBlurChange={setPrice} />
          <output>{price}</output>
        </>
      );
    };
    render(<Price />);
    expect(field().value).toBe('19.50');
    fireEvent.focus(field());
    type('20');
    fireEvent.blur(field());
    expect(field().value).toBe('20.00');
    expect(screen.getByRole('status')).toHaveTextContent('20.00');
  });
});

// Vite compiles with the automatic JSX runtime (jsx()), where React 19 ignores
// defaultProps on function components. Jest's classic runtime still applies them,
// so these render through jsx() to prove the defaults come from default parameters.
describe('NumericField with the automatic JSX runtime', () => {
  it('formats to an integer on blur by default (onBlurFormat)', () => {
    render(jsx(NumericField, { value: 3.7 }));
    expect(field().value).toBe('4');
  });

  it('does not forward its internal defaults to the input', () => {
    render(jsx(NumericField, { value: 3 }));
    expect(field()).not.toHaveAttribute('focusvalue');
    expect(field()).not.toHaveAttribute('onblurformat');
  });
});

describe('NumericField as a TextBox', () => {
  it('takes the TextBox label, hint and error', () => {
    const { container } = render(<NumericField label="Quantity" hint="Whole numbers" error="Too many" value={3} />);
    const input = screen.getByLabelText('Quantity');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAccessibleDescription('Whole numbers Too many');
    expect(input).toBeInvalid();
    expect(container.querySelector('.volta-textbox.volta-numericfield')).toBeInTheDocument();
  });
});
