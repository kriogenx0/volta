import React from 'react';
import PropTypes from 'prop-types';

import './FieldHint.scss';

// Help text under a form control ("Use your work email"). Give it an `id` and
// point the control's aria-describedby at it, so a screen reader reads it with
// the control. Field, TextBox and NativeSelect do this for you.
const FieldHint = ({ id, children }) => (
  <p className="volta-field_hint" id={id}>{children}</p>
);

FieldHint.fieldPart = 'hint';

FieldHint.propTypes = {
  // What the control's aria-describedby refers to
  id: PropTypes.string,
  children: PropTypes.node
};

export { FieldHint };
export default FieldHint;
