import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import './TextEditable.scss';

export default function TextEditable({
  tagName = 'div',
  className = '',
  disabled,
  value: valueProp,
  children,
  onChange,
  onBlur,
  onFinish,
  ...props
}) {
  const elRef = useRef(null);
  const initialValue = useRef(null);
  const lastHtml = useRef(null);

  const getValue = () => (elRef.current ? elRef.current.innerHTML : null);

  useEffect(() => {
    initialValue.current = getValue();
  }, []);

  const handleKeyDown = (e) => {
    const el = elRef.current;
    if (!el) return;
    if (e.key === 'Enter') {
      el.blur();
    } else if (e.key === 'Escape') {
      el.innerHTML = initialValue.current;
      el.blur();
    }
  };

  const handleChange = (e) => {
    const html = getValue();
    if (html === null) return;

    if (onChange && html !== lastHtml.current) onChange(html, e);
    lastHtml.current = html;
  };

  const handleBlur = (e) => {
    const value = getValue();
    initialValue.current = value;
    if (onBlur) onBlur(value, e);
    handleChange(e);
    if (onFinish) onFinish(value, e);
  };

  // Prefer what the user has typed so a re-render doesn't reset the content.
  const html = getValue() || valueProp || children;

  return React.createElement(tagName, {
    ...props,
    ref: elRef,
    className: `volta-text_editable ${className}`,
    onKeyDown: handleKeyDown,
    onInput: handleChange,
    onBlur: handleBlur,
    contentEditable: !disabled,
    dangerouslySetInnerHTML: { __html: html },
  });
}

TextEditable.propTypes = {
  tagName: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFinish: PropTypes.func,
};
