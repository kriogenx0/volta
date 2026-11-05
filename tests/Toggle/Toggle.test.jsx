import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Toggle from '../../components/Toggle/Toggle';

describe('Toggle', () => {
  it('renders without crashing', () => {
    const { container } = render(<Toggle />);
    expect(container).toBeInTheDocument();
  });

  it('is a checkbox that takes its accessible name from aria-label', () => {
    render(<Toggle aria-label="Dark mode" />);
    expect(screen.getByRole('checkbox', { name: 'Dark mode' })).not.toBeChecked();
  });

  it('starts on with defaultChecked and flips on its own when uncontrolled', () => {
    render(<Toggle aria-label="Dark mode" defaultChecked />);
    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
    fireEvent.click(input);
    expect(input).not.toBeChecked();
  });

  it('can be shown on without an onChange handler and without React warnings', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Toggle aria-label="Dark mode" checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('adds the checked class only when checked', () => {
    const { container, rerender } = render(<Toggle aria-label="Dark mode" checked={false} />);
    expect(container.firstChild).toHaveClass('volta-toggle');
    expect(container.firstChild).not.toHaveClass('toggle-checked');
    rerender(<Toggle aria-label="Dark mode" checked />);
    expect(container.firstChild).toHaveClass('toggle-checked');
  });

  it('reports the new state and follows a controlling parent', () => {
    const states = [];
    const Controlled = () => {
      const [on, setOn] = useState(false);
      return <Toggle aria-label="Notifications" checked={on} onChange={(e) => { states.push(e.target.checked); setOn(e.target.checked); }} />;
    };
    render(<Controlled />);
    const input = screen.getByRole('checkbox');
    fireEvent.click(input);
    expect(input).toBeChecked();
    fireEvent.click(input);
    expect(input).not.toBeChecked();
    expect(states).toEqual([true, false]);
  });

  it('passes name and value to the input', () => {
    render(<Toggle aria-label="Notifications" name="notifications" value="yes" />);
    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('name', 'notifications');
    expect(input).toHaveAttribute('value', 'yes');
  });

  it('really disables the input when isDisabled, not just the look', () => {
    const { container } = render(<Toggle aria-label="Locked" isDisabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(container.firstChild).toHaveClass('toggle-disabled');
  });

  it('is enabled by default', () => {
    const { container } = render(<Toggle aria-label="Dark mode" />);
    expect(screen.getByRole('checkbox')).toBeEnabled();
    expect(container.firstChild).not.toHaveClass('toggle-disabled');
  });

  it('adds a custom className to the wrapper', () => {
    const { container } = render(<Toggle aria-label="Dark mode" className="extra" />);
    expect(container.firstChild).toHaveClass('volta-toggle', 'extra');
  });
});
