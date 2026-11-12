import React, { useState } from 'react';

import { NativeSlider, SegmentedControl, Theme } from '../../components';

import ThemePicker from './ThemePicker';

import './ThemeSwitcher.scss';

// The accent that is showing, for the custom accent input to start from.
const currentAccent = () => getComputedStyle(document.documentElement).getPropertyValue('--v-accent').trim();

const ThemeSwitcher = () => {
  const [themeId, setThemeId] = useState(Theme.presets[0].id);
  const [accent, setAccent] = useState('#4A90E2');
  const [scheme, setScheme] = useState(Theme.getColorScheme());
  const [speed, setSpeed] = useState(150);
  const [shape, setShape] = useState(Theme.getShape());

  // A theme replaces the whole look, including a custom accent.
  const handleThemeChange = (theme) => {
    Theme.applyTheme(theme);
    setThemeId(theme.id);
    setAccent(currentAccent());
  };

  const handleAccentChange = (e) => {
    setAccent(e.target.value);
    Theme.setAccentColor(e.target.value);
  };

  const handleSchemeChange = (value) => {
    setScheme(value);
    Theme.setColorScheme(value);
    setAccent(currentAccent());
  };

  const handleShapeChange = (value) => {
    setShape(value);
    Theme.setShape(value);
  };

  const handleSpeedChange = (ms) => {
    setSpeed(ms);
    Theme.setAnimationSpeed(ms);
  };

  return (
    <div className="v-theme_switcher" aria-label="Preview settings">
      <ThemePicker value={themeId} onChange={handleThemeChange} />

      <label className="v-theme_switcher-accent" title="Custom accent color">
        <span className="sr-only">Custom accent color</span>
        <input type="color" value={accent} onChange={handleAccentChange} />
      </label>

      <SegmentedControl
        size="sm"
        value={scheme}
        onChange={handleSchemeChange}
        ariaLabel="Preview theme"
        options={[
          { label: 'Auto', value: 'system' },
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ]}
      />

      <SegmentedControl
        size="sm"
        value={shape}
        onChange={handleShapeChange}
        ariaLabel="Shape"
        options={Theme.shapes.map((name) => ({ label: name.charAt(0).toUpperCase() + name.slice(1), value: name }))}
      />

      <label className="v-theme_switcher-speed" title="Animation speed">
        <span className="sr-only">Animation speed</span>
        <NativeSlider
          aria-label="Animation speed"
          min={0}
          max={500}
          step={10}
          value={speed}
          onChange={handleSpeedChange}
        />
        <span className="v-theme_switcher-value">{speed} ms</span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
