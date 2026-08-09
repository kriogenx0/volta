import React, { useState } from 'react';

import { Theme } from '../components';

import './ThemeSwitcher.scss';

const ThemeSwitcher = () => {
  const [accent, setAccent] = useState('#4A90E2');
  const [scheme, setScheme] = useState(Theme.getColorScheme());
  const [speed, setSpeed] = useState(150);

  const handleAccentChange = (e) => {
    setAccent(e.target.value);
    Theme.setAccentColor(e.target.value);
  };

  const handleSchemeChange = (e) => {
    setScheme(e.target.value);
    Theme.setColorScheme(e.target.value);
  };

  const handleSpeedChange = (e) => {
    const ms = Number(e.target.value);
    setSpeed(ms);
    Theme.setAnimationSpeed(ms);
  };

  return (
    <div className="v-theme_switcher">
      <label>
        Accent
        <input type="color" value={accent} onChange={handleAccentChange} />
      </label>

      <label>
        Theme
        <select value={scheme} onChange={handleSchemeChange}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label>
        Animation speed
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={speed}
          onChange={handleSpeedChange}
        />
        <span className="v-theme_switcher-value">{speed}ms</span>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
