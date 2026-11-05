import PropTypes from 'prop-types';
import ReactQuill from 'react-quill-new';

import 'react-quill-new/dist/quill.snow.css';
import './RichTextQuill.scss';

const RichTextQuill = (props) => (
  <ReactQuill {...props} modules={RichTextQuill.modules} className={`volta-rich_text_quill${props.className ? ` ${props.className}` : ''}`} />
);

RichTextQuill.modules = {
  toolbar: [
    [{ font: [] }, { size: [] }],
    [{ align: [] }, 'direction'],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ script: 'super' }, { script: 'sub' }],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
};

// The toolbar (modules) is fixed; every other ReactQuill prop is passed through.
RichTextQuill.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  value: PropTypes.string
};

export default RichTextQuill;
