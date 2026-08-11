import React, { useState } from 'react';

import { SegmentedControl, Theme } from '../../components';

import './ThemeSwitcher.scss';

const ThemeSwitcher = () => {
  const [accent, setAccent] = useState('#4A90E2');
  const [scheme, setScheme] = useState(Theme.getColorScheme());
  const [speed, setSpeed] = useState(150);

  const handleAccentChange = (e) => {
    setAccent(e.target.value);
    Theme.setAccentColor(e.target.value);
  };

  const handleSchemeChange = (value) => {
    setScheme(value);
    Theme.setColorScheme(value);
  };

  const handleSpeedChange = (e) => {
    const ms = Number(e.target.value);
    setSpeed(ms);
    Theme.setAnimationSpeed(ms);
  };

  return (
    <div className="v-theme_switcher" aria-label="Preview settings">
      <label className="v-theme_switcher-accent" title="Accent color">
        <span className="sr-only">Accent color</span>
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

      <label className="v-theme_switcher-speed" title="Animation speed">
        <span className="sr-only">Animation speed</span>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={speed}
          onChange={handleSpeedChange}
        />
        <span className="v-theme_switcher-value">{speed} ms</span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
