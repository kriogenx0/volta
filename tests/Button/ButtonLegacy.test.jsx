import { render, screen } from '@testing-library/react';

import Button from '../../components/Button/Button';

let warn;

beforeEach(() => {
  Button.resetDeprecationWarnings();
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warn.mockRestore();
});

const button = () => screen.getByRole('button');
const warnings = () => warn.mock.calls.map((args) => args[0]);

describe('Button variant and size', () => {
  it.each(Button.variantTypes)('gives variant %s its class, without a warning', (variant) => {
    render(<Button variant={variant}>Go</Button>);
    expect(button()).toHaveClass('volta-button', `button-${variant}`);
    expect(warn).not.toHaveBeenCalled();
  });

  it.each(Button.sizes)('gives size %s its class, without a warning', (size) => {
    render(<Button size={size}>Go</Button>);
    expect(button()).toHaveClass(`button-${size}`);
    expect(warn).not.toHaveBeenCalled();
  });

  it('is a plain button, of the default look, with no props', () => {
    render(<Button>Go</Button>);
    expect(button()).toHaveAttribute('type', 'button');
    expect(button()).toHaveClass('button-default');
    expect(warn).not.toHaveBeenCalled();
  });

  it.each([['submit'], ['reset'], ['button']])('still takes the HTML type %s, without a warning', (type) => {
    render(<Button type={type}>Go</Button>);
    expect(button()).toHaveAttribute('type', type);
    expect(warn).not.toHaveBeenCalled();
  });
});

describe('Button legacy props, still honoured but deprecated', () => {
  describe('tiny', () => {
    it('still makes a tiny button', () => {
      render(<Button tiny>Go</Button>);
      expect(button()).toHaveClass('button-tiny');
    });

    it('warns, and says what to use', () => {
      render(<Button tiny>Go</Button>);
      expect(warnings()).toEqual(['Button: the tiny prop is deprecated; use size="tiny".']);
    });

    it('wins over size, as it always did', () => {
      render(<Button tiny size="large">Go</Button>);
      expect(button()).toHaveClass('button-tiny');
      expect(button()).not.toHaveClass('button-large');
    });
  });

  describe('bsStyle', () => {
    it.each(Button.variantTypes)('still chooses the %s look', (name) => {
      render(<Button bsStyle={name}>Go</Button>);
      expect(button()).toHaveClass(`button-${name}`);
    });

    it('warns once per value, naming the variant to use', () => {
      render(<><Button bsStyle="primary">A</Button><Button bsStyle="primary">B</Button></>);
      expect(warnings()).toEqual(['Button: the bsStyle prop is deprecated; use variant="primary".']);
    });

    it('warns without a suggestion for a name that is not a variant', () => {
      render(<Button bsStyle="success">Go</Button>);
      expect(button()).toHaveClass('button-success');
      expect(warnings()).toEqual(['Button: the bsStyle prop is deprecated; use variant.']);
    });

    it('yields to variant, as it always did', () => {
      render(<Button variant="danger" bsStyle="primary">Go</Button>);
      expect(button()).toHaveClass('button-danger');
    });
  });

  describe('type used to pick the look', () => {
    it.each(Button.variantTypes)('type="%s" still picks the look, and is a plain HTML button', (type) => {
      render(<Button type={type}>Go</Button>);
      expect(button()).toHaveClass(`button-${type}`);
      expect(button()).toHaveAttribute('type', 'button');
    });

    it('warns, and explains what type is for', () => {
      render(<Button type="primary">Go</Button>);
      expect(warnings()).toEqual(['Button: type="primary" picks the look and is deprecated; use variant="primary" (type is the HTML button type: button, submit or reset).']);
    });
  });

  it('warns once for each way, however many buttons use it', () => {
    render(<><Button tiny>A</Button><Button tiny>B</Button><Button bsStyle="link">C</Button><Button type="danger">D</Button></>);
    expect(warnings()).toHaveLength(3);
  });

  it('warns again after the memory is reset', () => {
    const { rerender } = render(<Button tiny>Go</Button>);
    expect(warn).toHaveBeenCalledTimes(1);
    Button.resetDeprecationWarnings();
    rerender(<Button tiny>Again</Button>);
    expect(warn).toHaveBeenCalledTimes(2);
  });
});
