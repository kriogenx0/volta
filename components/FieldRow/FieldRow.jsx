import React from 'react';
import PropTypes from 'prop-types';

import ErrorText from '../ErrorText/ErrorText';
import FieldHint from '../FieldHint/FieldHint';
import { FieldContext, useFieldSetup } from '../Field/fieldContext';

import './FieldRow.scss';

// A label on the left and the control on the right, connected the way Field's
// are: the label points at the one control inside, which is described by the hint
// and error; with several controls the label names the group.
const FieldRow = ({ label, hint, error, htmlFor, children, centered }) => {
  const { controlId, labelId, hintId, errorId, single, describedBy, context } = useFieldSetup({ htmlFor, hint, error, children });
  const groupProps = !single && label ? { role: 'group', 'aria-labelledby': labelId, 'aria-describedby': describedBy } : {};

  return (
    <FieldContext.Provider value={context}>
      <div className={`volta-field_row${centered ? ' field_row-centered' : ''}`}>
        <label className="field_row-label" id={labelId} htmlFor={single ? controlId : undefined}>{label}</label>
        <div className="field_row-body" {...groupProps}>
          {children}
          {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
          {error && <div id={errorId} className="field_row-error"><ErrorText message={error} /></div>}
        </div>
      </div>
    </FieldContext.Provider>
  );
};

FieldRow.propTypes = {
  label: PropTypes.node,
  // Help text under the control, read with it by a screen reader
  hint: PropTypes.string,
  // An error message under the control; marks the control invalid
  error: PropTypes.string,
  // The id of a control this row doesn't make (a native <input id="...">)
  htmlFor: PropTypes.string,
  centered: PropTypes.bool,
  children: PropTypes.node
};

export default FieldRow;
