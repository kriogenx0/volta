import { useState } from 'react';

const CKEditor = ({ fieldName, fieldValue }) => {
  const [state, setState] = useState({
    fieldValue,
    showWYSIWYG: false
  });

  const beginEdit = () => {
    setState((prev) => ({ ...prev, showWYSIWYG: true }));
  };

  const initEditor = () => {
    function toggle() {
      CKEDITOR.replace('editor', { toolbar: 'Basic', width: 870, height: 150 });
      CKEDITOR.instances.editor.on('blur', () => {
        const data = CKEDITOR.instances.editor.getData();
        setState({
          fieldValue: escape(data),
          showWYSIWYG: false
        });
        CKEDITOR.instances.editor.destroy();
      });
    }
    window.setTimeout(toggle, 100);
  };

  if (state.showWYSIWYG) {
    initEditor(fieldName);
    return (
      <textarea name='editor' cols="100" rows="6" defaultValue={unescape(state.fieldValue)}></textarea>
    );
  }

  return (
    <p className='description_field' onClick={beginEdit}>{unescape(state.fieldValue)}</p>
  );
};

export default CKEditor;
