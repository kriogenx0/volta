import { useEffect, useRef, useState } from 'react';
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

// How long the popover waits after focus leaves before it closes, so a click on a
// swatch still lands.
const CLOSE_DELAY = 200;

// A colour field: a native colour chooser, a hex text box and a palette of presets,
// or with `popover` a text box with a swatch button that opens the palette. `show`
// picks what is there: the picker (chooser and text box), the palette, or both. What
// is typed is checked, and a valid colour is reported as #RRGGBB.
const ColorPicker = ({
  name = 'color',
  value: controlledValue,
  initialValue = '#FFFFFF',
  palette = DEFAULT_PALETTE,
  popover = false,
  show = 'both',
  onChange,
  onValueChange = () => {},
  updateColor,
  ...inputProps
}) => {
  // null means "not given", as it did for ColorPalettePicker
  const controlled = controlledValue !== undefined && controlledValue !== null;
  const externalValue = controlled ? controlledValue : initialValue;
  const [color, setColor] = useState(() => normalize(externalValue));
  const [text, setText] = useState(() => normalize(externalValue));
  const [showing, setShowing] = useState(false);
  const closing = useRef(null);

  const showPicker = show !== 'palette';
  const showPalette = show !== 'picker';
  // Only a palette can open in a popover
  const inPopover = popover && showPalette;

  // Don't let a pending close fire after the picker is gone
  useEffect(() => () => clearTimeout(closing.current), []);

  useEffect(() => {
    if (!controlled) return;
    const next = normalize(controlledValue);
    setColor(next);
    // Keep what the user is typing (e.g. "#fff") while it already means this color
    setText((current) => (normalize(current, null) === next ? current : next));
  }, [controlled, controlledValue]);

  // Reports a valid color. While typing, the text box is left alone so a short
  // form like "#123" doesn't get rewritten to "#112233" mid-keystroke.
  const commit = (nextValue, { syncText = true } = {}) => {
    const next = normalize(nextValue, null);
    if (!next) return false;

    if (!controlled) setColor(next);
    if (syncText) setText(next);
    onChange?.(next);
    onValueChange(next);
    updateColor?.(next);
    return true;
  };

  // The popover opens when the text box or a swatch gets focus, and closes shortly
  // after focus leaves the whole picker, on Escape, or when a swatch is chosen.
  const cancelClose = () => clearTimeout(closing.current);

  const open = () => {
    cancelClose();
    if (inPopover) setShowing(true);
  };

  const scheduleClose = () => {
    if (!inPopover) return;
    closing.current = setTimeout(() => setShowing(false), CLOSE_DELAY);
  };

  const handleKeyDown = (event) => {
    if (inPopover && event.key === 'Escape') setShowing(false);
  };

  const chooseSwatch = (swatch) => {
    commit(swatch);
    if (inPopover) setShowing(false);
  };

  const handleTextChange = (event) => {
    const next = event.target.value;
    setText(next);
    commit(next, { syncText: false });
  };

  // Tidy the text once the user is done: a valid entry is shown in full hex
  // form, an invalid one goes back to the current color.
  const handleBlur = () => setText(normalize(text, null) || color);

  const swatches = palette.map((swatch, index) => {
    const normalized = normalize(swatch);
    return (
      <button
        key={`${swatch}-${index}`}
        type="button"
        className={`color_picker-swatch${normalized === color ? ' is-selected' : ''}`}
        style={{ backgroundColor: normalized }}
        aria-label={`Select ${normalized}`}
        aria-pressed={normalized === color}
        onClick={() => chooseSwatch(normalized)}
      />
    );
  });

  return (
    <div
      className={`volta-color_picker${inPopover ? ' volta-color_picker--popover' : ''}`}
      onFocus={inPopover ? cancelClose : undefined}
      onBlur={inPopover ? scheduleClose : undefined}
      onKeyDown={inPopover ? handleKeyDown : undefined}
    >
      {(showPicker || inPopover) && (
        <div className="color_picker-control">
          {showPicker && !inPopover && (
            <input
              className="color_picker-native"
              type="color"
              value={color}
              aria-label="Choose color"
              onChange={(event) => commit(event.target.value)}
            />
          )}
          {showPicker && (
            <input
              {...inputProps}
              className={`color_picker-input ${inputProps.className || ''}`.trim()}
              type="text"
              name={name}
              value={text}
              aria-label={inputProps['aria-label'] || 'Hex color'}
              onChange={handleTextChange}
              onFocus={(event) => { open(); if (inputProps.onFocus) inputProps.onFocus(event); }}
              onBlur={(event) => { handleBlur(); if (inputProps.onBlur) inputProps.onBlur(event); }}
              spellCheck="false"
            />
          )}
          {inPopover && (
            <button
              type="button"
              className="color_picker-toggle"
              style={{ backgroundColor: color }}
              aria-label="Toggle color palette"
              aria-expanded={showing}
              onClick={() => setShowing((current) => !current)}
            />
          )}
        </div>
      )}
      {/* With only the palette there is no text box to carry the value in a form */}
      {!showPicker && <input type="hidden" name={name} value={color} />}
      {showPalette && (
        <div
          className={`color_picker-palette${showing ? ' showing' : ''}`}
          role="group"
          aria-label="Color palette"
          onFocus={open}
          onMouseDown={inPopover ? () => setTimeout(cancelClose, 10) : undefined}
        >
          {swatches}
        </div>
      )}
    </div>
  );
};

ColorPicker.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  initialValue: PropTypes.string,
  palette: PropTypes.arrayOf(PropTypes.string),
  // The palette opens from a swatch button, or when the text box has focus, instead of always showing
  popover: PropTypes.bool,
  // What to show: the picker (the colour chooser and the hex text box), the palette, or both
  show: PropTypes.oneOf(['both', 'palette', 'picker']),
  onChange: PropTypes.func,
  onValueChange: PropTypes.func,
  updateColor: PropTypes.func,
};

// ColorPalettePicker is a ColorPicker that opens its palette in a popover, with a wider
// palette of 20 presets, kept for existing callers. Its text box is named "Color".
const ColorPalettePicker = (props) => (
  <ColorPicker popover palette={ColorPalettePicker.colors} aria-label="Color" {...props} />
);

ColorPalettePicker.colors = [
  '#ff0000', '#F06060', '#ffa500', '#F0B460', '#ffff00',
  '#60F06E', '#008000', '#50E3C2', '#60D8F0', '#60AAF0',
  '#0011dd', '#4A90E2', '#9060F0', '#800080', '#fc5bca',
  '#ffffff', '#CCCCCC', '#9B9B9B', '#444444', '#000000'
];

export { ColorPicker, ColorPalettePicker };
export default ColorPicker;
