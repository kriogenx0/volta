import { render, screen, fireEvent } from '@testing-library/react';

import Card from './Card';

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('adds the selectable class', () => {
    render(<Card selectable>Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('control-card-selectable');
  });

  it('adds the selected class', () => {
    render(<Card selected>Hello</Card>);
    expect(screen.getByText('Hello')).toHaveClass('control-card-selected');
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Card onClick={onClick}>Hello</Card>);
    fireEvent.click(screen.getByText('Hello'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
