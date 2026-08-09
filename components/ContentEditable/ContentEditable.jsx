import { useRef, useEffect } from 'react';

const ContentEditable = ({ html, onChange }) => {
  const ref = useRef(null);
  const lastHtml = useRef(html);

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
      ref={ref}
      onInput={handleChange}
      onBlur={handleChange}
      contentEditable
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default ContentEditable;
