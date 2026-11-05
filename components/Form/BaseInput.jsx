import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './BaseInput.scss';

const BaseInput = ({ autoSelect, inputType, fieldName, centered, displayName }) => {
  const inputRef = useRef(null);

  // Focus once on mount. (A ref callback would run on every render, pulling
  // focus back to this field each time the form re-rendered.)
  useEffect(() => {
    if (autoSelect && inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="volta-base_input">
      <input
        ref={inputRef}
        type={inputType}
        name={fieldName}
        className={`txt l-full-width ${centered ? 'l-text-align-center' : ''}`}
        placeholder={displayName}
        aria-label={displayName}
      />
    </div>
  );
};

BaseInput.propTypes = {
  autoSelect: PropTypes.bool,
  inputType: PropTypes.string,
  fieldName: PropTypes.string,
  centered: PropTypes.bool,
  displayName: PropTypes.string
};

export default BaseInput;
