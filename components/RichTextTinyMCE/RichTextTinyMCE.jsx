import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

const RichTextTinyMCE = ({ value, onChange }) => (
  <Editor
    // Self-hosted TinyMCE assets (see webpack.config.js's CopyWebpackPlugin
    // entry, which copies node_modules/tinymce to compiled/tinymce/) --
    // no tiny.cloud API key needed. TinyMCE is a legacy global-registering
    // script, not an ES module, so it has to be loaded this way rather
    // than imported directly.
    tinymceScriptSrc="tinymce/tinymce.min.js"
    licenseKey="gpl"
    value={value}
    onEditorChange={onChange}
    init={{
      license_key: 'gpl',
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    }}
  />
);

RichTextTinyMCE.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default RichTextTinyMCE;
