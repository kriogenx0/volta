import React, { useEffect, useId, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { Theme } from '../../components';

import './ThemePicker.scss';

// What a theme leaves out falls back to the stock palette.
const STOCK = { lightBase: '#ffffff', darkBase: '#050505' };

// The colours a swatch shows: the page and the accent, in light and in dark.
export const swatchColors = (preset) => ({
  lightBase: preset.light['--v-color-base'] || STOCK.lightBase,
  lightAccent: preset.light['--v-accent'],
  darkBase: preset.dark['--v-color-base'] || STOCK.darkBase,
  darkAccent: preset.dark['--v-accent']
});

// A chip split into the light half and the dark half, each an accent dot on
// that scheme's page colour. The values are only known at runtime, so they are
// passed as custom properties for ThemePicker.scss to use.
const Swatch = ({ preset }) => {
  const c = swatchColors(preset);
  return (
    <span
      className="v-theme_picker-swatch"
      aria-hidden="true"
      style={{
        '--swatch-light-base': c.lightBase,
        '--swatch-light-accent': c.lightAccent,
        '--swatch-dark-base': c.darkBase,
        '--swatch-dark-accent': c.darkAccent
      }}
    >
      <span className="v-theme_picker-swatch-light" />
      <span className="v-theme_picker-swatch-dark" />
    </span>
  );
};

Swatch.propTypes = { preset: PropTypes.object.isRequired };

const ThemePicker = ({ value, onChange, themes = Theme.presets }) => {
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (index) => `${id}-option-${index}`;

  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const selectedIndex = Math.max(0, themes.findIndex((theme) => theme.id === value));
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(selectedIndex);
  const selected = themes[selectedIndex];

  const openList = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus && buttonRef.current) buttonRef.current.focus();
  };

  const choose = (index) => {
    onChange(themes[index]);
    close();
  };

  // Focus moves into the list while it is open, so the arrow keys work there.
  useEffect(() => {
    if (open && listRef.current) listRef.current.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const option = document.getElementById(optionId(active));
    if (option) option.scrollIntoView({ block: 'nearest' });
    return undefined;
  }, [open, active]);

  // A click anywhere else closes it without stealing focus from what was clicked.
  useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) close(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [open]);

  const handleButtonKeyDown = (event) => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const handleListKeyDown = (event) => {
    const last = themes.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActive((index) => Math.min(last, index + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActive((index) => Math.max(0, index - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActive(0);
        break;
      case 'End':
        event.preventDefault();
        setActive(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        choose(active);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close(false);
        break;
      default:
    }
  };

  return (
    <div className={`v-theme_picker${open ? ' is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="v-theme_picker-button"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={`Theme: ${selected.name}`}
        onClick={() => (open ? close() : openList())}
        onKeyDown={handleButtonKeyDown}
      >
        <Swatch preset={selected} />
        <span className="v-theme_picker-name">{selected.name}</span>
        <span className="v-theme_picker-chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul
          className="v-theme_picker-list"
          id={listId}
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          aria-label="Themes"
          aria-activedescendant={optionId(active)}
          onKeyDown={handleListKeyDown}
        >
          {themes.map((theme, index) => (
            <li
              key={theme.id}
              id={optionId(index)}
              role="option"
              aria-selected={index === selectedIndex}
              className={`v-theme_picker-option${index === active ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              <Swatch preset={theme} />
              <span className="v-theme_picker-name">{theme.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ThemePicker.propTypes = {
  // The id of the theme that is showing
  value: PropTypes.string,
  // Called with the chosen theme object
  onChange: PropTypes.func.isRequired,
  themes: PropTypes.arrayOf(PropTypes.object)
};

export default ThemePicker;
