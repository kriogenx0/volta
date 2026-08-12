import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';

import TextBox from '../TextBox';

import './ColorPalettePicker.scss';

const ColorPalettePicker = ({ value: valueProp, onChange }) => {
  const [showing, setShowing] = useState(false);
  const [value, setValue] = useState(undefined);
  const blurring = useRef(null);

  useEffect(() => {
    if (valueProp !== null) {
      setValue(valueProp);
    }
  }, [valueProp]);

  const selectColor = (color) => {
    setValue(color);
    setShowing(false);
    onChange(color);
  };

  const handleTextChange = (e) => {
    setValue(e.target.value);
  };

  const handleFocus = () => {
    setShowing(true);
  };

  const handleBlur = () => {
    blurring.current = setTimeout(() => {
      setShowing(false);
    }, 200);
  };

  const dontBlur = () => {
    setTimeout(() => {
      clearTimeout(blurring.current);
    }, 10);
  };

  const toggle = () => {
    // TODO focus on input if showing
    setShowing((prev) => !prev);
  };

  return (
    <div className='volta-color_palette_picker'>
      <TextBox value={value} onFocus={handleFocus} onBlur={handleBlur} onChange={handleTextChange} />
      <div className='color-current' style={{backgroundColor: value}} onClick={toggle} />
      <div className={`colors clearfix${showing ? ' showing' : ''}`} onMouseDown={dontBlur}>
        {_.map(ColorPalettePicker.colors, (color) => {
          return (
            <div key={color} style={{backgroundColor: color}} title={color} onClick={() => selectColor(color)} />
          );
        })}
      </div>
    </div>
  );
};

ColorPalettePicker.defaultProps = {
  value: null,
  onChange: () => {}
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
