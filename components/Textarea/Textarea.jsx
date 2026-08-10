import React from 'react';
import TextField from '../TextField/TextField';

const Textarea = ({ resize = 'both', className = '', ...props }) => {
  const resizeClass = resize === 'none' ? 'resize-none' : resize === 'y' ? 'resize-y' : '';
  return <TextField multiline className={`${resizeClass} ${className}`.trim()} {...props} />;
};

export { Textarea };
export default Textarea;
