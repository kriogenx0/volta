import React from 'react';
import TextField from '../TextField/TextField';

const Textarea = ({ resize = 'both', className = '', height, style, ...props }) => {
  const resizeClass = resize === 'none' ? 'resize-none' : resize === 'y' ? 'resize-y' : '';
  // ironyoung-compat: height is a plain inline-style pixel/CSS value on the <textarea>
  // itself, matching its own ui/Textarea's height prop.
  const textareaStyle = height !== undefined ? { ...style, height } : style;
  // ironyoung-compat: c-textarea is the class name its own view-level scss targets directly
  // (on the wrapper div, matching FormControls.scss's `.c-textarea > textarea` selector).
  return <TextField multiline wrapperClassName='c-textarea' className={`${resizeClass} ${className}`.trim()} style={textareaStyle} {...props} />;
};

export { Textarea };
export default Textarea;
