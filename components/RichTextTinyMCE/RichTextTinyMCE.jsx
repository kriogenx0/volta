import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

// TinyMCE is self-hosted (the build copies node_modules/tinymce to
// compiled/tinymce/), so no tiny.cloud API key is needed. It is a legacy
// global-registering script, not an ES module, so it is loaded by URL rather
// than imported. The URL is relative to the page, so it works when the page is
// served from the site root; give `tinymceScriptSrc` when the copy lives elsewhere.
const DEFAULT_SCRIPT_SRC = 'tinymce/tinymce.min.js';

const RichTextTinyMCE = ({
  value,
  onChange,
  disabled,
  readonly,
  placeholder,
  height,
  tinymceScriptSrc = DEFAULT_SCRIPT_SRC,
  className,
  init
}) => (
  // The wrapper carries `className`: the Editor itself ignores it.
  <div className={`volta-rich_text_tinymce${className ? ` ${className}` : ''}`}>
    <Editor
      tinymceScriptSrc={tinymceScriptSrc}
      licenseKey="gpl"
      value={value}
      onEditorChange={onChange}
      disabled={disabled}
      readonly={readonly}
      init={{
        license_key: 'gpl',
        plugins: 'link image code',
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
        // Anything TinyMCE takes (skin, content_css, menubar, ...) overrides the defaults above.
        ...init,
        // Options of their own, which win over `init`
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(height !== undefined ? { height } : {})
      }}
    />
  </div>
);

RichTextTinyMCE.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  // Turns the editor off (TinyMCE shows it read-only, and it follows the prop as it changes)
  disabled: PropTypes.bool,
  // Shows the content but doesn't let it be edited
  readonly: PropTypes.bool,
  // Grey text shown while the editor is empty
  placeholder: PropTypes.string,
  // The editor's height: a number of pixels, or a CSS length such as '300px'
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Where TinyMCE's script is served from
  tinymceScriptSrc: PropTypes.string,
  // Added to the wrapper element around the editor
  className: PropTypes.string,
  // Extra TinyMCE init options, for what has no prop here: skin (for dark mode), content_css, menubar, plugins, toolbar...
  init: PropTypes.object
};

export default RichTextTinyMCE;
