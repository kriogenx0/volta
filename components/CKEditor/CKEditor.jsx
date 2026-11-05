import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// A click-to-edit text field. The value is kept escaped (see escape()), which is
// the format fieldValue is given in.
//
// Editing uses CKEditor 4 when the page provides it as the global CKEDITOR (it
// is not bundled with this library). Without it the field still works, editing
// in a plain textarea.
const CKEditor = ({ fieldName = 'editor', fieldValue = '', placeholder = 'Click to edit' }) => {
  const [value, setValue] = useState(fieldValue);
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef(null);

  const beginEdit = () => setEditing(true);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      beginEdit();
    }
  };

  useEffect(() => {
    if (!editing) return undefined;

    const { CKEDITOR } = window;
    if (!CKEDITOR) {
      textareaRef.current.focus();
      return undefined;
    }

    let editor;
    const destroy = () => {
      if (editor) {
        const instance = editor;
        editor = null;
        instance.destroy();
      }
    };

    const timer = window.setTimeout(() => {
      CKEDITOR.replace(fieldName, { toolbar: 'Basic', width: 870, height: 150 });
      editor = CKEDITOR.instances[fieldName];
      editor.on('blur', () => {
        const data = editor.getData();
        destroy();
        setValue(escape(data));
        setEditing(false);
      });
    }, 100);

    return () => {
      window.clearTimeout(timer);
      destroy();
    };
  }, [editing, fieldName]);

  if (editing) {
    // Without CKEDITOR, leaving the textarea saves it
    const handleBlur = window.CKEDITOR ? undefined : (e) => {
      setValue(escape(e.target.value));
      setEditing(false);
    };

    return (
      <textarea
        ref={textareaRef}
        name={fieldName}
        aria-label={fieldName}
        cols="100"
        rows="6"
        className="volta-ckeditor"
        defaultValue={unescape(value)}
        onBlur={handleBlur}
      ></textarea>
    );
  }

  const text = unescape(value);
  return (
    <p
      className={`volta-ckeditor description_field${text ? '' : ' volta-ckeditor--empty'}`}
      role="button"
      tabIndex={0}
      onClick={beginEdit}
      onKeyDown={handleKeyDown}
    >
      {text || placeholder}
    </p>
  );
};

CKEditor.propTypes = {
  fieldName: PropTypes.string,
  // Escaped, as escape() would produce it
  fieldValue: PropTypes.string,
  placeholder: PropTypes.string
};

export default CKEditor;
