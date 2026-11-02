import React from 'react';
import PropTypes from 'prop-types';

import './FieldLabel.scss';

// The label above a form control (TextField, Select). Not the same as Label,
// which wraps a control and its caption in one <label>.
const FieldLabel = ({ htmlFor, optional, children }) => (
  <label htmlFor={htmlFor} className="volta-field_label">
    {children}{optional && <span className="volta-field_label-optional"> (optional)</span>}
  </label>
);

FieldLabel.propTypes = {
  htmlFor: PropTypes.string,
  optional: PropTypes.bool
};

export { FieldLabel };
export default FieldLabel;
