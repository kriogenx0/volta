import { render, screen, fireEvent } from '@testing-library/react';

import { Theme } from '../../components';
import ThemeSwitcher from '../../styleguide/views/ThemeSwitcher';

const token = (name) => document.documentElement.style.getPropertyValue(name);

describe('ThemeSwitcher', () => {
  afterEach(() => {
    Theme.resetTheme();
    Theme.resetShape();
    Theme.setColorScheme('system');
  });

  const chooseTheme = (name) => {
    fireEvent.click(screen.getByRole('button', { name: /^Theme:/ }));
    fireEvent.click(screen.getByRole('option', { name }));
  };

  it('starts on the stock theme without changing any colour', () => {
    render(<ThemeSwitcher />);
    expect(screen.getByRole('button', { name: 'Theme: Volta' })).toBeInTheDocument();
    expect(Theme.getTheme()).toBeNull();
    expect(token('--v-accent')).toBe('');
  });

  it('applies the chosen theme to the page', () => {
    render(<ThemeSwitcher />);
    chooseTheme('Ocean');
    expect(Theme.getTheme().id).toBe('ocean');
    expect(token('--v-accent')).not.toBe('');
    expect(screen.getByRole('button', { name: 'Theme: Ocean' })).toBeInTheDocument();
  });

  it('can switch from one theme to another, and back to Volta', () => {
    render(<ThemeSwitcher />);
    chooseTheme('Sunset');
    chooseTheme('Rose');
    expect(Theme.getTheme().id).toBe('rose');
    chooseTheme('Volta');
    expect(Theme.getTheme().id).toBe('volta');
    expect(token('--v-accent')).toBe('#4A90E2');
  });

  it('lets a custom accent sit on top of the chosen theme', () => {
    const { container } = render(<ThemeSwitcher />);
    chooseTheme('Forest');
    const forestNeutral = token('--v-color-trim');
    fireEvent.change(container.querySelector('input[type="color"]'), { target: { value: '#ff0000' } });
    expect(token('--v-accent')).toBe('#ff0000');
    expect(token('--v-color-trim')).toBe(forestNeutral);
  });

  it('drops the custom accent when another theme is chosen, and the accent input follows the theme', () => {
    const { container } = render(<ThemeSwitcher />);
    fireEvent.change(container.querySelector('input[type="color"]'), { target: { value: '#ff0000' } });
    chooseTheme('Violet');
    const violet = Theme.presets.find((preset) => preset.id === 'violet');
    expect(token('--v-accent')).toBe(violet.light['--v-accent']);
    expect(container.querySelector('input[type="color"]').value).toBe(violet.light['--v-accent']);
  });

  it('switches to the dark half of the theme with the scheme control', () => {
    render(<ThemeSwitcher />);
    chooseTheme('Midnight');
    const midnight = Theme.presets.find((preset) => preset.id === 'midnight');
    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(token('--v-accent')).toBe(midnight.dark['--v-accent']);
  });

  it('has a shape control: rounded to start, then square or pill', () => {
    render(<ThemeSwitcher />);
    const group = screen.getByRole('group', { name: 'Shape' });
    expect(screen.getByRole('button', { name: 'Rounded' })).toHaveAttribute('aria-pressed', 'true');
    expect(group).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Pill' }));
    expect(Theme.getShape()).toBe('pill');
    expect(screen.getByRole('button', { name: 'Pill' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Square' }));
    expect(Theme.getShape()).toBe('square');
  });
});
