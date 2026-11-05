import React from 'react';
import PropTypes from 'prop-types';
import TextField from '../TextField/TextField';

// resize prop -> class on the <textarea>; TextField.scss maps these to the CSS resize property.
const RESIZE_CLASS = { both: 'resize-both', y: 'resize-y', none: 'resize-none' };

const Textarea = ({ resize = 'both', className = '', height, style, ...props }) => {
  const resizeClass = RESIZE_CLASS[resize] || '';
  // ironyoung-compat: height is a plain inline-style pixel/CSS value on the <textarea>
  // itself, matching its own ui/Textarea's height prop.
  const textareaStyle = height !== undefined ? { ...style, height } : style;
  // ironyoung-compat: c-textarea is the class name its own view-level scss targets directly
  // (on the wrapper div, matching FormControls.scss's `.c-textarea > textarea` selector).
  return <TextField multiline wrapperClassName='c-textarea' className={`${resizeClass} ${className}`.trim()} style={textareaStyle} {...props} />;
};

Textarea.propTypes = {
  // Which directions the user can drag the corner handle to resize
  resize: PropTypes.oneOf(['both', 'y', 'none']),
  className: PropTypes.string,
  // Height of the textarea: a number of pixels or any CSS length
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object
};

export { Textarea };
export default Textarea;
