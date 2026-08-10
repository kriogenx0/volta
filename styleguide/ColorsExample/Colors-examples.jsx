import { useState } from 'react';
import './Colors-examples.scss';

const colorTokens = [
  {
    section: 'Base',
    description: 'Used for backgrounds and surfaces. Light mode is near-white; dark mode near-black.',
    colors: [
      { name: 'color_base',              light: '#ffffff', dark: '#111111', variable: '$color_base',              use: 'Page background' },
      { name: 'color_base_more_subtle',  light: '#f2f2f2', dark: '#1d1d1d', variable: '$color_base_more_subtle',  use: 'Subtle surface, hover' },
      { name: 'color_base_subtle',       light: '#e6e6e6', dark: '#2a2a2a', variable: '$color_base_subtle',       use: 'Borders, dividers' },
      { name: 'color_base_less_subtle',  light: '#cccccc', dark: '#444444', variable: '$color_base_less_subtle',  use: 'Strong borders' },
    ]
  },
  {
    section: 'Trim',
    description: 'Used for text and foreground elements that contrast against the base.',
    colors: [
      { name: 'color_trim',             light: '#111111', dark: '#ffffff', variable: '$color_trim',             use: 'Primary text' },
      { name: 'color_trim_subtle',      light: '#2a2a2a', dark: '#e6e6e6', variable: '$color_trim_subtle',      use: 'Secondary text, labels' },
      { name: 'color_trim_more_subtle', light: '#1d1d1d', dark: '#f2f2f2', variable: '$color_trim_more_subtle', use: 'Muted / placeholder text' },
    ]
  },
  {
    section: 'Active',
    description: 'Used for interactive elements — links, primary buttons, selected states.',
    colors: [
      { name: 'color_active',        light: '#4A90E2', dark: '#2997ff', variable: '$color_active',        use: 'Buttons, links, focus rings' },
      { name: 'color_active_subtle', light: '#E5F0FC', dark: '#234A78', variable: '$color_active_subtle', use: 'Selected row, active bg' },
    ]
  },
  {
    section: 'Semantic',
    description: 'Status and feedback colors that carry meaning.',
    colors: [
      { name: 'color_danger',        light: '#e30000', dark: '#e30000', variable: '$color_danger',        use: 'Error, destructive actions' },
      { name: 'color_danger_subtle', light: '#fff2f4', dark: '#3d0000', variable: '$color_danger_subtle', use: 'Error backgrounds' },
      { name: 'color_success',       light: '#03A10E', dark: '#03A10E', variable: '$color_success',       use: 'Success states' },
      { name: 'color_inactive',      light: '#A1A5A9', dark: '#6d7378', variable: '$color_inactive',      use: 'Disabled, inactive' },
    ]
  }
];

const ColorSwatch = ({ color, showDark }) => {
  const [copied, setCopied] = useState(false);
  const hexValue = showDark ? color.dark : color.light;

  const handleCopy = () => {
    navigator.clipboard.writeText(hexValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="color-token">
      <div
        className="color-swatch"
        style={{ backgroundColor: hexValue }}
        onClick={handleCopy}
        title={`Copy ${hexValue}`}
      >
        <span className="copy-hint">{copied ? '✓ Copied' : 'Click to copy'}</span>
      </div>
      <div className="color-info">
        <div className="color-hex">{hexValue}</div>
        <div className="color-variable">{color.variable}</div>
        <div className="color-use">{color.use}</div>
      </div>
    </div>
  );
};

const ColorsExample = () => {
  const [showDark, setShowDark] = useState(false);

  return (
    <section className="view-colors">
      <header className="section-header">
        <div>
          <h2>Colors</h2>
          <p>Volta's color system is built for automatic dark mode. Every token has a light and dark variant.</p>
        </div>
        <button
          className={`theme-toggle ${showDark ? 'dark-active' : ''}`}
          onClick={() => setShowDark(!showDark)}
        >
          {showDark ? '☀ Light' : '☾ Dark'} values
        </button>
      </header>

      <div className="usage-note">
        <strong>Usage in SCSS:</strong>
        <code>{`@include property-color(background-color, base);`}</code>
        <code>{`@include text-color(trim);`}</code>
        <code>{`@include bg-color(active_subtle);`}</code>
      </div>

      {colorTokens.map(group => (
        <div className="color-group" key={group.section}>
          <div className="color-group-header">
            <h3>{group.section}</h3>
            <p>{group.description}</p>
          </div>
          <div className="color-grid">
            {group.colors.map(color => (
              <ColorSwatch key={color.name} color={color} showDark={showDark} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ColorsExample;
