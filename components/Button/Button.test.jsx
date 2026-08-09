import { render, screen, fireEvent } from '@testing-library/react';

import Button from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('prefers the label prop over children when both are given', () => {
    render(<Button label="Save">Ignored</Button>);
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
  });

  it('applies the default variant class', () => {
    render(<Button>Default</Button>);
    expect(screen.getByText('Default')).toHaveClass('button-default');
  });

  it('applies a variant class', () => {
    render(<Button variant="primary">Go</Button>);
    expect(screen.getByText('Go')).toHaveClass('button-primary');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('adds the disabled class without disabling clicks (matches native div semantics)', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toHaveClass('button-disabled');
  });
});
