import React, { useId } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from '../ErrorMessage/ErrorMessage';
import FieldHint from '../FieldHint/FieldHint';
import FieldLabel from '../FieldLabel/FieldLabel';
import { useFieldControl } from '../Field/fieldContext';

import './TextBox.scss';

// resize prop -> class on the <textarea>; TextBox.scss maps these to the CSS resize property.
const RESIZE_CLASS = { both: 'resize-both', y: 'resize-y', none: 'resize-none' };

// A single line of text, or with `multiline` a textarea (resize and height apply
// to that). A label, hint and error of its own are linked to the input; inside a
// Field (or FieldRow) it takes that one's id, hint and error as well.
const TextBox = ({ disabled, multiline, resize = 'both', height, style, validate, error, hint, label, optional, fieldSize = 'sm', className = '', wrapperClassName = '', id, ...inputProps }) => {
  const generatedId = useId();
  const inField = useFieldControl({ id, 'aria-describedby': inputProps['aria-describedby'], 'aria-invalid': inputProps['aria-invalid'] });
  // The id the input gets: the caller's, the Field's, or one made here for its own label
  const controlId = inField.id || (label ? generatedId : undefined);
  const fieldId = controlId || generatedId;
  const handleKeyUp = validate ? (event) => validate(event.target.value) : inputProps.onKeyUp;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [inField['aria-describedby'], hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  const controlProps = {
    ...inputProps,
    id: controlId,
    disabled,
    onKeyUp: handleKeyUp,
    className: (multiline ? `${RESIZE_CLASS[resize] || ''} ${className}`.trim() : className) || undefined,
    // ironyoung-compat: height is a plain inline-style pixel/CSS value on the <textarea> itself.
    style: multiline && height !== undefined ? { ...style, height } : style,
    'aria-invalid': error ? true : inField['aria-invalid'],
    'aria-describedby': describedBy
  };
  const control = multiline ? <textarea {...controlProps} /> : <input type={inputProps.type || 'text'} {...controlProps} />;

  const field = (
    <div className={`volta-textbox volta-textbox--${fieldSize} ${multiline ? 'c-textarea' : 'c-text_box'}${wrapperClassName ? ` ${wrapperClassName}` : ''}${error ? ' textbox-error' : ''}${disabled ? ' textbox-disabled' : ''}${multiline ? ' textbox-multiline' : ''}`}>
      {control}
    </div>
  );

  if (!label && !hint && !error) return field;
  return (
    <div>
      {label && <FieldLabel htmlFor={fieldId} optional={optional}>{label}</FieldLabel>}
      {field}
      {hint && <FieldHint id={hintId}>{hint}</FieldHint>}
      {error && <div id={errorId} className="volta-textbox-error_message"><ErrorMessage message={error} role={null} /></div>}
    </div>
  );
};

TextBox.propTypes = {
  disabled: PropTypes.bool,
  // A textarea instead of a single line
  multiline: PropTypes.bool,
  // Which way the user can drag a multiline box's corner handle
  resize: PropTypes.oneOf(['both', 'y', 'none']),
  // Height of a multiline box: a number of pixels or any CSS length
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  validate: PropTypes.func,
  error: PropTypes.string,
  // Help text under the field, read with it by a screen reader
  hint: PropTypes.string,
  label: PropTypes.string,
  optional: PropTypes.bool,
  fieldSize: PropTypes.oneOf(['sm', 'md'])
};

// TextField and Textarea are other names for TextBox, kept for existing callers.
// ironyoung-compat: c-text_box and c-textarea are the class names its own view-level
// scss targets directly (on the wrapper div, matching `.c-textarea > textarea`).
const TextField = TextBox;
const Textarea = (props) => <TextBox multiline {...props} />;

export { TextBox, TextField, Textarea };
export default TextBox;
