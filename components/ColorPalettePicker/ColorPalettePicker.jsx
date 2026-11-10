import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { TextBox } from '../TextBox/TextBox';

import './ColorPalettePicker.scss';
import { map } from '../../util/collection';

const sameColor = (a, b) => typeof a === 'string' && typeof b === 'string' && a.toLowerCase() === b.toLowerCase();

// A text box for a color value, with a swatch that opens a palette of presets.
// `onChange(color)` is called for typed text and for a chosen swatch.
const ColorPalettePicker = ({ value: valueProp = null, onChange = () => {} }) => {
  const [showing, setShowing] = useState(false);
  const [value, setValue] = useState(valueProp ?? '');
  const blurring = useRef(null);

  useEffect(() => {
    if (valueProp !== null) {
      setValue(valueProp);
    }
  }, [valueProp]);

  // Don't let a pending close fire after the picker is gone
  useEffect(() => () => clearTimeout(blurring.current), []);

  const selectColor = (color) => {
    setValue(color);
    setShowing(false);
    onChange(color);
  };

  const handleTextChange = (e) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  // Focus anywhere inside cancels a pending close; focus in the text box or a
  // swatch also opens the palette. It closes shortly after focus leaves, so a
  // click on a swatch still lands. (The toggle button manages itself.)
  const cancelClose = () => clearTimeout(blurring.current);

  const handleFocus = () => {
    cancelClose();
    setShowing(true);
  };

  const handleBlur = () => {
    blurring.current = setTimeout(() => {
      setShowing(false);
    }, 200);
  };

  const dontBlur = () => {
    setTimeout(cancelClose, 10);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') setShowing(false);
  };

  const toggle = () => {
    // TODO focus on input if showing
    setShowing((prev) => !prev);
  };

  return (
    <div className='volta-color_palette_picker' onFocus={cancelClose} onBlur={handleBlur} onKeyDown={handleKeyDown}>
      <TextBox value={value} onFocus={handleFocus} onChange={handleTextChange} aria-label="Color" />
      <button
        type="button"
        className='color-current'
        style={{ backgroundColor: value }}
        aria-label="Toggle color palette"
        aria-expanded={showing}
        onClick={toggle}
      />
      <div className={`colors clearfix${showing ? ' showing' : ''}`} role="group" aria-label="Color palette" onFocus={handleFocus} onMouseDown={dontBlur}>
        {map(ColorPalettePicker.colors, (color) => (
          <button
            type="button"
            key={color}
            style={{ backgroundColor: color }}
            title={color}
            aria-label={`Select ${color}`}
            aria-pressed={sameColor(color, value)}
            onClick={() => selectColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

ColorPalettePicker.propTypes = {
  // The current color, as any CSS color string; null leaves it up to the user
  value: PropTypes.string,
  // (color) => called when a swatch is chosen or the text changes
  onChange: PropTypes.func
};

ColorPalettePicker.colors = [
  '#ff0000',
  '#F06060',
  '#ffa500',
  '#F0B460',
  '#ffff00',
  '#60F06E',
  '#008000',
  '#50E3C2',
  '#60D8F0',
  '#60AAF0',
  '#0011dd',
  '#4A90E2',
  '#9060F0',
  '#800080',
  '#fc5bca',
  '#ffffff',
  '#CCCCCC',
  '#9B9B9B',
  '#444444',
  '#000000'
];

export default ColorPalettePicker;
