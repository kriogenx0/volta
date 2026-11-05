import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './ContentEditable.scss';

// Other props (an aria-label, for instance) go to the editable element.
const ContentEditable = ({ html = '', onChange, className, ...otherProps }) => {
  const ref = useRef(null);
  const lastHtml = useRef(html);

  // React is only given the first html. If it saw every change it would rewrite
  // the element's content as the user types and the caret would jump to the
  // start; later changes from outside are written by the effect below.
  const [initialHtml] = useState(() => ({ __html: html }));

  useEffect(() => {
    if (ref.current && html !== lastHtml.current) {
      ref.current.innerHTML = html;
      lastHtml.current = html;
    }
  }, [html]);

  const handleChange = () => {
    const value = ref.current.innerHTML;
    if (onChange && value !== lastHtml.current) {
      onChange({ target: { value } });
    }
    lastHtml.current = value;
  };

  return (
    <div
      role="textbox"
      aria-multiline="true"
      {...otherProps}
      ref={ref}
      className={`volta-content_editable${className ? ` ${className}` : ''}`}
      onInput={handleChange}
      onBlur={handleChange}
      contentEditable
      dangerouslySetInnerHTML={initialHtml}
    />
  );
};

ContentEditable.propTypes = {
  className: PropTypes.string,
  html: PropTypes.string,
  onChange: PropTypes.func
};

export default ContentEditable;
