import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

import NativeColorPicker from '../NativeColorPicker/NativeColorPicker';
import ColorPickerSquare from './color-picker-square';
import ColorPickerSlider from './color-picker-slider';

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

// The colours the text box shows and onChange reports: #RRGGBB, rgb(r, g, b) or hsl(h, s%, l%).
// Anything tinycolor reads can be typed or passed in, whichever form this is.
const FORMATS = ['hex', 'rgb', 'hsl'];
const formatColor = (hex, format) => {
  const parsed = tinycolor(hex);
  if (format === 'rgb') return parsed.toRgbString();
  if (format === 'hsl') return parsed.toHslString();
  return parsed.toHexString().toUpperCase();
};

// How long the popover waits after focus leaves before it closes, so a click on a
// swatch still lands.
const CLOSE_DELAY = 200;

// A colour field: a colour chooser, a text box and a palette of presets, or with
// `popover` a text box with a swatch button that opens the palette. `show` picks what
// is there: the picker (chooser and text box), the palette, or both. `picker` picks the
// chooser: the browser's own (NativeColorPicker) or Volta's, a saturation and
// brightness square over a hue slider. `side` puts the swatch (the native chooser, or the
// popover's button) on the left or right of the text box, and `textbox={false}` leaves the
// text box out. What is typed is checked: hex, rgb(), hsl(), or a colour name, and a valid
// colour is shown and reported in `format` (#RRGGBB by default).
const ColorPicker = ({
  name = 'color',
  value: controlledValue,
  initialValue = '#FFFFFF',
  palette = DEFAULT_PALETTE,
  popover = false,
  show = 'both',
  picker = 'native',
  format = 'hex',
  textbox = true,
  side,
  onChange,
  onValueChange = () => {},
  updateColor,
  ...inputProps
}) => {
  // null means "not given", as it did for ColorPalettePicker
  const controlled = controlledValue !== undefined && controlledValue !== null;
  const externalValue = controlled ? controlledValue : initialValue;
  const [color, setColor] = useState(() => normalize(externalValue));
  const [text, setText] = useState(() => formatColor(normalize(externalValue), format));
  const [showing, setShowing] = useState(false);
  const closing = useRef(null);

  const showPicker = show !== 'palette';
  const showText = textbox && showPicker;
  const showPalette = show !== 'picker';
  // Only a palette can open in a popover
  const inPopover = popover && showPalette;
  const custom = picker === 'custom' && showPicker;

  // The hue is kept apart from the colour: white, black and greys have none, and
  // dragging the square to one would otherwise lose it.
  const [hue, setHue] = useState(() => Math.round(tinycolor(normalize(externalValue)).toHsl().h));

  // Don't let a pending close fire after the picker is gone
  useEffect(() => () => clearTimeout(closing.current), []);

  useEffect(() => {
    const { h, s, l } = tinycolor(color).toHsl();
    if (s > 0 && l > 0 && l < 1) setHue(Math.round(h));
  }, [color]);

  useEffect(() => {
    if (!controlled) return;
    const next = normalize(controlledValue);
    setColor(next);
    // Keep what the user is typing (e.g. "#fff") while it already means this color
    setText((current) => (normalize(current, null) === next ? current : formatColor(next, format)));
  }, [controlled, controlledValue, format]);

  // A change of format rewrites the text box in the new form
  useEffect(() => { setText(formatColor(color, format)); }, [format]);

  // Reports a valid color. While typing, the text box is left alone so a short
  // form like "#123" doesn't get rewritten to "#112233" mid-keystroke.
  const commit = (nextValue, { syncText = true } = {}) => {
    const next = normalize(nextValue, null);
    if (!next) return false;

    const out = formatColor(next, format);
    if (!controlled) setColor(next);
    if (syncText) setText(out);
    onChange?.(out);
    onValueChange(out);
    updateColor?.(out);
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
  const handleBlur = () => setText(formatColor(normalize(text, null) || color, format));

  const handleSquare = ({ saturation, lightness }) => {
    commit(tinycolor({ h: hue, s: saturation, l: lightness }).toHexString());
  };

  const handleHue = (nextHue) => {
    setHue(nextHue);
    const { s, l } = tinycolor(color).toHsl();
    commit(tinycolor({ h: nextHue, s: s * 100, l: l * 100 }).toHexString());
  };

  const hsl = tinycolor(color).toHsl();
  const customPanel = custom && (
    <div className="color_picker-custom">
      <ColorPickerSquare
        hue={hue}
        saturation={hsl.s * 100}
        lightness={hsl.l * 100}
        onColorChange={handleSquare}
      />
      <ColorPickerSlider hue={hue} onHueChange={handleHue} />
    </div>
  );

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

  // The swatch that sits by the text box: the native chooser, or the popover's button. It is on
  // the left, except for the popover's button, which is on the right unless `side` says left.
  const chooser = inPopover ? (
    <button
      type="button"
      className="color_picker-toggle"
      style={{ backgroundColor: color }}
      aria-label="Toggle color palette"
      aria-expanded={showing}
      onClick={() => setShowing((current) => !current)}
    />
  ) : (showPicker && !custom ? <NativeColorPicker className="color_picker-native" value={color} onChange={commit} /> : null);
  const chooserFirst = side ? side === 'left' : !inPopover;

  const textInput = showText ? (
    <input
      {...inputProps}
      className={`color_picker-input${format === 'hex' ? ' color_picker-input--hex' : ''} ${inputProps.className || ''}`.trim()}
      type="text"
      name={name}
      value={text}
      aria-label={inputProps['aria-label'] || (format === 'hex' ? 'Hex color' : `${format.toUpperCase()} color`)}
      onChange={handleTextChange}
      onFocus={(event) => { open(); if (inputProps.onFocus) inputProps.onFocus(event); }}
      onBlur={(event) => { handleBlur(); if (inputProps.onBlur) inputProps.onBlur(event); }}
      spellCheck="false"
    />
  ) : null;

  const classes = [
    'volta-color_picker',
    inPopover && 'volta-color_picker--popover',
    chooser && textInput && `volta-color_picker--chooser_${chooserFirst ? 'left' : 'right'}`,
    !textInput && 'volta-color_picker--no_text',
    // Nothing wide to show: just the swatch
    !textInput && !showPalette && !custom && 'volta-color_picker--compact'
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onFocus={inPopover ? cancelClose : undefined}
      onBlur={inPopover ? scheduleClose : undefined}
      onKeyDown={inPopover ? handleKeyDown : undefined}
    >
      {!inPopover && customPanel}
      {(chooser || textInput) && (
        <div className="color_picker-control">
          {chooserFirst ? chooser : textInput}
          {chooserFirst ? textInput : chooser}
        </div>
      )}
      {/* Without a text box there is nothing to carry the value in a form */}
      {!textInput && <input type="hidden" name={name} value={formatColor(color, format)} />}
      {showPalette && (
        <div
          className={`color_picker-palette${showing ? ' showing' : ''}`}
          role="group"
          aria-label="Color palette"
          onFocus={open}
          onMouseDown={inPopover ? () => setTimeout(cancelClose, 10) : undefined}
        >
          {inPopover && customPanel}
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
  // The colour chooser: the browser's own (NativeColorPicker), or Volta's own square and hue slider
  picker: PropTypes.oneOf(['native', 'custom']),
  // How the colour is written in the text box and reported: #RRGGBB, rgb(r, g, b) or hsl(h, s%, l%)
  format: PropTypes.oneOf(FORMATS),
  // Show the text box (on by default); off leaves the swatch, the picker or the palette
  textbox: PropTypes.bool,
  // Which side of the text box the swatch is on (left for the native chooser, right for the popover's button by default)
  side: PropTypes.oneOf(['left', 'right']),
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

ColorPicker.formats = FORMATS;

export { ColorPicker, ColorPalettePicker };
export default ColorPicker;
