import fs from 'fs';
import path from 'path';
import { render, screen, fireEvent } from '@testing-library/react';

import ComboBox from '../../components/ComboBox/ComboBox';

const options = ['Apple', 'Apricot', 'Banana'];

describe('ComboBox', () => {
  it('renders without crashing', () => {
    const { container } = render(<ComboBox />);
    expect(container).toBeInTheDocument();
  });

  it('opens a menu of options on focus', () => {
    const { container } = render(<ComboBox options={options} />);
    expect(screen.queryByText('Apple')).toBeNull();
    fireEvent.focus(screen.getByRole('textbox'));
    expect(container.firstChild).toHaveClass('is_open');
    expect(screen.getByText('Apple')).toHaveClass('volta-combo_box-option');
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('filters options by what is typed', () => {
    render(<ComboBox options={options} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ap' } });
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Apricot')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).toBeNull();
  });

  it('highlights options with the arrow keys and commits with Enter', () => {
    const onSelect = jest.fn();
    render(<ComboBox options={options} onSelect={onSelect} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Apple')).toHaveClass('volta-combo_box-option--highlighted');
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('Apple');
  });

  it('selects an option by clicking it', () => {
    const onSelect = jest.fn();
    render(<ComboBox options={options} onSelect={onSelect} />);
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.click(screen.getByText('Banana'));
    expect(onSelect).toHaveBeenCalledWith('Banana');
  });
});

describe('ComboBox arrow keys with nothing to choose', () => {
  it('does not break when it has no options at all', () => {
    render(<ComboBox options={[]} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toHaveValue('');
  });

  it('highlights from the first option when options arrive after an arrow key found none', () => {
    const { rerender } = render(<ComboBox options={[]} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });

    rerender(<ComboBox options={options} />);
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Apple')).toHaveClass('volta-combo_box-option--highlighted');
  });
});

// jsdom loads no CSS, so the animation is checked in the stylesheet's source.
describe('ComboBox opening animation', () => {
  const scss = fs.readFileSync(path.join(__dirname, '../../components/ComboBox/ComboBox.scss'), 'utf8');

  it('drops the open list down using the global animation speed and easing', () => {
    expect(scss).toMatch(/&\.is_open > \.contents\s*\{[^}]*animation:\s*volta-combo-box-open var\(--v-anim-speed\) var\(--v-anim-ease\)/);
    const keyframes = scss.match(/@keyframes volta-combo-box-open\s*\{[\s\S]*?\n\}/)[0];
    expect(keyframes).toMatch(/from\s*\{[^}]*opacity:\s*0[^}]*translateY\(-\d+px\)/);
    expect(keyframes).toMatch(/to\s*\{[^}]*opacity:\s*1[^}]*transform:\s*none/);
  });

  it('has no duration of its own, so reduce motion and the speed setting apply', () => {
    expect(scss).not.toMatch(/animation[^;]*\d+m?s\b/);
  });

  it('shows the list only while open', () => {
    render(<ComboBox options={options} />);
    expect(screen.queryByText('Apple')).toBeNull();
    fireEvent.focus(screen.getByRole('textbox'));
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });
});
