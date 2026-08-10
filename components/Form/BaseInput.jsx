import PropTypes from 'prop-types';

const BaseInput = ({ autoSelect, inputType, fieldName, centered, displayName }) => {
  const inputRef = (el) => {
    if (el && autoSelect) el.focus();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type={inputType}
        name={fieldName}
        className={`txt l-full-width ${centered ? 'l-text-align-center' : ''}`}
        placeholder={displayName}
        style={{ marginBottom: '10px' }}
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
