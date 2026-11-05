// Re-usable form row element to be used in a form builder.
import PropTypes from 'prop-types';

import './FormRow.scss';

const FormRow = ({
  label = null, optionalText = null, helperText = null, isFlush, errors = [], showError = false, className = '', children
}) => (
  <div className={`volta-form_row ${showError ? 'is-error' : ''} ${className}`}>
    <div className="frm_row_description">
      <p className={`frm_label ${isFlush ? 'frm_label-flush' : ''}`}>{label}</p>
      {optionalText && <p className="frm_details deemphasized">{optionalText}</p>}
    </div>
    <div className="frm_row_body">
      {children}
      {showError && errors.map((error, index) => (
        <p className="frm_error" key={index}><i />{error}</p>
      ))}
      {helperText && <p className="l-v-top-half-spaced">{helperText}</p>}
    </div>
  </div>
);

FormRow.propTypes = {
  label: PropTypes.string,
  optionalText: PropTypes.string,
  helperText: PropTypes.string,
  isFlush: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.string),
  showError: PropTypes.bool,
  isValid: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

export default FormRow;
