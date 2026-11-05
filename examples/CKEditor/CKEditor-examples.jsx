import CKEditor from '../../components/CKEditor/CKEditor';

export default {
  name: 'CKEditor',
  description: 'A click-to-edit text field. Click it (or focus it and press Enter) to edit; leave the field to save. It edits with CKEditor 4 when the page provides the CKEDITOR global, otherwise in a plain textarea. fieldValue is an escaped string.',
  examples: [
    {
      name: 'With a value',
      code: '<CKEditor fieldName="summary" fieldValue="A short summary of the project." />',
      output: <CKEditor fieldName="summary" fieldValue="A short summary of the project." />
    },
    {
      name: 'Empty, with a placeholder',
      code: '<CKEditor fieldName="notes" placeholder="Add notes" />',
      output: <CKEditor fieldName="notes" placeholder="Add notes" />
    },
    {
      name: 'Escaped value',
      code: '<CKEditor fieldName="order" fieldValue="Fish%20%26%20chips%20for%20two" />',
      output: <CKEditor fieldName="order" fieldValue="Fish%20%26%20chips%20for%20two" />
    },
    {
      name: 'Two fields on one page',
      code: `<CKEditor fieldName="intro" fieldValue="Intro text" />
<CKEditor fieldName="outro" fieldValue="Outro text" />`,
      output: (
        <div className="example-stack">
          <CKEditor fieldName="intro" fieldValue="Intro text" />
          <CKEditor fieldName="outro" fieldValue="Outro text" />
        </div>
      )
    }
  ]
};
