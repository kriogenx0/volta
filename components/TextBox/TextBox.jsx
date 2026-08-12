import { useState, useEffect } from 'react';

import './TextBox.scss';

const TextBox = (props) => {
  const { value, onChange, multiline, ...rest } = props;
  const [internalValue, setInternalValue] = useState(value || '');

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    if (e && e.target && onChange) {
      onChange(e);
    }
  };

  const fieldProps = { ...rest, onChange: handleChange, value: internalValue };

  return (
    <div className="volta-text_box">
      {multiline ?
        <textarea {...fieldProps}></textarea>
        :
        <input type="text" {...fieldProps} />
      }
    </div>
  );
};

TextBox.defaultProps = {
  multiline: false
};

export default TextBox;
