import { render, screen, fireEvent, within } from '@testing-library/react';

import { Theme } from '../../components';
import ThemePicker, { swatchColors } from '../../styleguide/views/ThemePicker';

const presets = Theme.presets;

describe('ThemePicker', () => {
  const setup = (props = {}) => {
    const onChange = jest.fn();
    const utils = render(<ThemePicker value="volta" onChange={onChange} {...props} />);
    return { onChange, button: screen.getByRole('button', { name: /^Theme:/ }), ...utils };
  };

  it('shows the chosen theme on a button that opens a listbox', () => {
    const { button } = setup({ value: 'ocean' });
    expect(button).toHaveAccessibleName('Theme: Ocean');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('falls back to the first theme for an unknown value', () => {
    const { button } = setup({ value: 'nope' });
    expect(button).toHaveAccessibleName(`Theme: ${presets[0].name}`);
  });

  it('lists every theme as an option and marks the chosen one', () => {
    const { button } = setup({ value: 'forest' });
    fireEvent.click(button);
    const options = within(screen.getByRole('listbox', { name: 'Themes' })).getAllByRole('option');
    expect(options).toHaveLength(presets.length);
    expect(options.map((option) => option.textContent)).toEqual(presets.map((preset) => preset.name));
    expect(screen.getByRole('option', { name: 'Forest' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'Ocean' })).toHaveAttribute('aria-selected', 'false');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows each theme with its own colours', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /^Theme:/ }));
    const ocean = presets.find((preset) => preset.id === 'ocean');
    const swatch = screen.getByRole('option', { name: 'Ocean' }).querySelector('.v-theme_picker-swatch');
    expect(swatch.style.getPropertyValue('--swatch-light-accent')).toBe(ocean.light['--v-accent']);
    expect(swatch.style.getPropertyValue('--swatch-dark-accent')).toBe(ocean.dark['--v-accent']);
  });

  it('reports a clicked theme and closes', () => {
    const { button, onChange } = setup();
    fireEvent.click(button);
    fireEvent.click(screen.getByRole('option', { name: 'Violet' }));
    expect(onChange).toHaveBeenCalledWith(presets.find((preset) => preset.id === 'violet'));
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(button).toHaveFocus();
  });

  it('moves focus into the list when it opens', () => {
    const { button } = setup();
    fireEvent.click(button);
    expect(screen.getByRole('listbox')).toHaveFocus();
  });

  it('opens with the arrow keys on the button, starting at the chosen theme', () => {
    const { button } = setup({ value: 'rose' });
    fireEvent.keyDown(button, { key: 'ArrowDown' });
    const list = screen.getByRole('listbox');
    expect(list).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Rose' }).id);
  });

  it('chooses with the arrow keys and Enter', () => {
    const { button, onChange } = setup({ value: 'volta' });
    fireEvent.click(button);
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    fireEvent.keyDown(list, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(presets[2]);
  });

  it('jumps to the first and last theme with Home and End, and stops at the ends', () => {
    const { button, onChange } = setup();
    fireEvent.click(button);
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(list, { key: 'End' });
    fireEvent.keyDown(list, { key: 'ArrowDown' });
    fireEvent.keyDown(list, { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(presets[presets.length - 1]);

    fireEvent.click(button);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Home' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'ArrowUp' });
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });
    expect(onChange).toHaveBeenLastCalledWith(presets[0]);
  });

  it('closes on Escape without choosing, and returns focus to the button', () => {
    const { button, onChange } = setup();
    fireEvent.click(button);
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(button).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('closes on a click outside, without stealing focus', () => {
    const { button, onChange } = setup();
    fireEvent.click(button);
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(button).not.toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('toggles closed when the button is clicked again', () => {
    const { button } = setup();
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('swatchColors', () => {
  it('uses the stock page colours for a theme that does not set them', () => {
    const ocean = presets.find((preset) => preset.id === 'ocean');
    expect(swatchColors(ocean)).toMatchObject({ lightBase: '#ffffff', darkBase: '#050505' });
  });

  it("uses a theme's own page colours when it has them", () => {
    const sepia = presets.find((preset) => preset.id === 'sepia');
    expect(swatchColors(sepia).lightBase).toBe(sepia.light['--v-color-base']);
    expect(swatchColors(sepia).darkBase).toBe(sepia.dark['--v-color-base']);
  });
});
