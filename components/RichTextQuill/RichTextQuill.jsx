import ReactQuill from 'react-quill-new';

import 'react-quill-new/dist/quill.snow.css';
import './RichTextQuill.scss';

const RichTextQuill = (props) => (
  <ReactQuill {...props} modules={RichTextQuill.modules} />
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

export default RichTextQuill;
