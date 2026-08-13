import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import './NumericField.scss';

const NumericField = (props) => {
  const previousValue = useRef(null);
  const whenTypingFormatFunction = useRef(
    NumericField.loadFormatFunction(props.whenTypingFormat || NumericField.defaultWhenTypingFormatFunction)
  );
  const format = useRef(NumericField.loadFormatFunction(props.format || props.onBlurFormat));
  const [value, setValue] = useState(() => format.current(props.value));

  useEffect(() => {
    whenTypingFormatFunction.current = NumericField.loadFormatFunction(props.whenTypingFormat || NumericField.defaultWhenTypingFormatFunction);
    format.current = NumericField.loadFormatFunction(props.format || props.onBlurFormat);

    setValue(format.current(props.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, props.whenTypingFormat, props.format, props.onBlurFormat]);

  const handleOnChange = (event) => {
    if (!event.target) { return; }

    var val = event.target.value;

    val = whenTypingFormatFunction.current(val);

    if (val !== null) {
      setValue(val);

      if (props.onChange) {
        props.onChange(val);
      }
    }
  };

  const handleOnFocus = (e) => {
    var val;
    // ONLY FIRST TIME
    if (previousValue.current === null && props.focusValue !== null) {
      val = props.focusValue;
      setValue(val);
    } else {
      val = e.target.value;
    }

    if (props.onFocus) {
      props.onFocus(e.target.value, previousValue.current);
    }

    previousValue.current = val;
  };

  const handleOnBlur = () => {
    var val = value;
    val = format.current(val);
    setValue(val);

    if (props.onBlur) {
      props.onBlur(val);
    }
    if (props.onBlurChange && previousValue.current !== val) {
      props.onBlurChange(val, previousValue.current);
    }
  };

  const inputProps = { ...props };
  delete inputProps.focusValue;
  delete inputProps.format;
  delete inputProps.onBlurChange;
  delete inputProps.onBlurFormat;
  delete inputProps.whenTypingFormat;

  return (
    <div className="volta-numericfield">
      <input {...inputProps} type="number"
             onChange={handleOnChange}
             onFocus={handleOnFocus}
             onBlur={handleOnBlur}
             value={value}
      />
    </div>
  );
};

NumericField.formats = {
  integer: (v) => {
    return numeral(v).format('0');
  },
  twoDecimal: (v) => {
    return numeral(v).format('0.00');
  },
  numeral: (value, format) => {
    return numeral(value).format(format);
  }
};

NumericField.loadFormatFunction = (format) => {
  // IF FUNCTION
  if (typeof format === 'function') {
    return format;
  }
  // IF formats EXISTS
  else if (NumericField.formats[format]) {
    return NumericField.formats[format];
  }
  // USE numeral
  else if (NumericField.formats.numeral && format) {
    return (v) => {
      return NumericField.formats.numeral(v, format);
    };
  }
  // EMPTY FUNCTION
  else {
    return (value) => { return value };
  }
};

NumericField.numeralRegex = new RegExp('^\\d*\\.?\\d*$');

NumericField.defaultWhenTypingFormatFunction = (val) => {
  // need to do this, otherwise parsing fails when trying to parse the value "."
  if (val === '.') { val = '0.'; }

  // block invalid character input by returning null
  if (!NumericField.numeralRegex.test(val)) {
    val = null;
  }

  return val;
};

NumericField.defaultProps = {
  onChange: null,
  onBlurFormat: 'integer',
  focusValue: null
};

NumericField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onBlurChange: PropTypes.func,
  focusValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  whenTypingFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
  onBlurFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func]),
  // format is an alias for onBlurFormat, it has been deprecated
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.func])
};

export default NumericField;
