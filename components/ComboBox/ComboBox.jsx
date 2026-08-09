import { useState } from 'react';
import PropTypes from 'prop-types';

import TextBox from '../TextBox';
import DropdownListItem from '../DropdownList/DropdownListItem';

import './ComboBox.scss';

const ComboBox = ({ open: openProp, defaultValue, items, onSelect, onChange }) => {
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(openProp || false);

  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  const delayedHide = () => {
    setTimeout(() => {
      hide();
    }, 50);
  };

  const handleAnySelect = (selected) => {
    setValue(selected);
    onSelect(selected);
    hide();
  };

  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  const handleTextPress = (e) => {
    // ENTER
    if (e.which === 13) {
      handleAnySelect(e.target.value);
    }
    // ESC
    else if (e.which === 27) {
      hide();
    }
    else if (!open) {
      show();
    }
  };

  const textBoxProps = {
    value: value !== null ? value : defaultValue,
    onChange: handleTextChange,
    onKeyPress: handleTextPress,
    onClick: show,
    onFocus: show,
    onBlur: delayedHide
  };

  return (
    <div className={'c-combo_box' + (open ? ' is_open' : '')}>
      <TextBox {...textBoxProps} />
      <div className='contents'>
        {_.map(items, (item, key) => (
          <DropdownListItem key={key} label={item} onSelect={() => handleAnySelect(item)} />
        ))}
      </div>
    </div>
  );
};

ComboBox.defaultProps = {
  defaultValue: '',
  items: [],
  onSelect: () => {},
  onChange: () => {}
};

ComboBox.propTypes = {
  items: PropTypes.array,
  // WHEN SELECTING A VALUE
  onSelect: PropTypes.func,
  // WHEN ENTERING A VALUE
  onChange: PropTypes.func
};

export default ComboBox;
