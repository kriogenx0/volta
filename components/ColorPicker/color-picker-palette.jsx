// Color Picker Palette
// Click on a color to return that HEX value
// Expects an initial array of colors and a callback for color selection

import PropTypes from 'prop-types';

const ColorPickerPalette = ({ colors, onColorSelect }) => (
  <ul className="cpr_palette">
    {colors.map((color, index) => (
      <li
        key={index}
        style={{ backgroundColor: color }}
        onClick={() => onColorSelect(color)}
      />
    ))}
  </ul>
);

ColorPickerPalette.propTypes = {
  colors: PropTypes.array,
  onColorSelect: PropTypes.func
};

ColorPickerPalette.defaultProps = {
  colors: [],
  onColorSelect: () => {}
};

export default ColorPickerPalette;
