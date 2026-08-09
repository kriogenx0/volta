// REQUIRES PACKAGE
// "react-tinymce": "^0.5.1"

import PropTypes from 'prop-types';
import TinyMCE from 'react-tinymce';

const RichTextTinyMCE = ({ value, onChange }) => {
  const handleEditorChange = (e) => {
    onChange(e.target.getContent());
  };

  return (
    <TinyMCE
      content={value}
      config={{
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
      }}
      onChange={handleEditorChange}
    />
  );
};

RichTextTinyMCE.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default RichTextTinyMCE;
