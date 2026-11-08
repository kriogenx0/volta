import PropTypes from 'prop-types';

import ErrorText from '../ErrorText/ErrorText';
import FieldHint from '../FieldHint/FieldHint';
import { FieldContext, useFieldSetup } from './fieldContext';

import './Field.scss';

// A label, a control, and optionally a hint and an error, connected for
// assistive technology. With one control inside (TextField, Textarea, Select, or
// any control given `htmlFor`'s id) the label points at it, the control is
// described by the hint and error, and it is marked invalid when there is an
// error. With several controls inside, the label names the group instead.
const Field = ({ className, type, stack, label, hint, error, htmlFor, children }) => {
  const { controlId, labelId, hintId, errorId, single, describedBy, context } = useFieldSetup({ htmlFor, hint, error, children });

  // ironyoung-compat: c-field is the class name its own view-level scss targets directly.
  let fieldClassName = 'volta-field c-field' + (className ? ' ' + className : '');
  if (type) fieldClassName += ' field-' + type;
  if (stack) fieldClassName += ' field-stack';

  const notes = (
    <>
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <div id={errorId} className="field-error"><ErrorText message={error} /></div>}
    </>
  );

  // Several controls share the label as a group; one is reached by `for`.
  const groupProps = !single && label ? { role: 'group', 'aria-labelledby': labelId, 'aria-describedby': describedBy } : {};

  const body = label ? (
    <>
      <label className='field-label' id={labelId} htmlFor={single ? controlId : undefined}>
        {label}
      </label>
      <div className='field-child' {...groupProps}>
        {children}
        {notes}
      </div>
      <div className='field-clear' />
    </>
  ) : (
    <>
      {children}
      {notes}
    </>
  );

  return (
    <FieldContext.Provider value={context}>
      <div className={fieldClassName}>{body}</div>
    </FieldContext.Provider>
  );
};

Field.propTypes = {
  label: PropTypes.string,
  // Help text under the control, read with it by a screen reader
  hint: PropTypes.string,
  // An error message under the control; marks the control invalid
  error: PropTypes.string,
  // The id of a control this Field doesn't make (a native <input id="...">)
  htmlFor: PropTypes.string,
  // stack: true, false, auto
  stack: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default Field;
