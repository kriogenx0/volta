import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

import './ColorPicker.scss';

const DEFAULT_PALETTE = [
  '#F06060', '#60AAF0', '#60F06E', '#F0D860',
  '#60D8F0', '#CCCCCC', '#F0B460', '#9060F0',
  '#4A90E2', '#50E3C2', '#9B9B9B', '#000000',
];

const normalize = (color, fallback = '#FFFFFF') => {
  const parsed = tinycolor(color);
  return parsed.isValid() ? parsed.toHexString().toUpperCase() : fallback;
};

const ColorPicker = ({
  name = 'color',
  value: controlledValue,
  initialValue = '#FFFFFF',
  palette = DEFAULT_PALETTE,
  onChange,
  onValueChange = () => {},
  updateColor,
  ...inputProps
}) => {
  const controlled = controlledValue !== undefined;
  const externalValue = controlled ? controlledValue : initialValue;
  const [color, setColor] = useState(() => normalize(externalValue));
  const [text, setText] = useState(() => normalize(externalValue));

  useEffect(() => {
    if (!controlled) return;
    const next = normalize(controlledValue);
    setColor(next);
    setText(next);
  }, [controlled, controlledValue]);

  const commit = (nextValue) => {
    const next = normalize(nextValue, null);
    if (!next) return false;

    if (!controlled) setColor(next);
    setText(next);
    onChange?.(next);
    onValueChange(next);
    updateColor?.(next);
    return true;
  };

  const handleTextChange = (event) => {
    const next = event.target.value;
    setText(next);
    commit(next);
  };

  const handleBlur = () => {
    if (!commit(text)) setText(color);
  };

  return (
    <div className="volta-color_picker">
      <div className="color_picker-control">
        <input
          className="color_picker-native"
          type="color"
          value={color}
          aria-label="Choose color"
          onChange={(event) => commit(event.target.value)}
        />
        <input
          {...inputProps}
          className={`color_picker-input ${inputProps.className || ''}`.trim()}
          type="text"
          name={name}
          value={text}
          aria-label={inputProps['aria-label'] || 'Hex color'}
          onChange={handleTextChange}
          onBlur={handleBlur}
          spellCheck="false"
        />
      </div>
      <div className="color_picker-palette" aria-label="Color palette">
        {palette.map((swatch) => {
          const normalized = normalize(swatch);
          return (
            <button
              key={swatch}
              type="button"
              className={`color_picker-swatch${normalized === color ? ' is-selected' : ''}`}
              style={{ backgroundColor: normalized }}
              aria-label={`Select ${normalized}`}
              aria-pressed={normalized === color}
              onClick={() => commit(normalized)}
            />
          );
        })}
      </div>
    </div>
  );
};

ColorPicker.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  initialValue: PropTypes.string,
  palette: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onValueChange: PropTypes.func,
  updateColor: PropTypes.func,
};

export default ColorPicker;
