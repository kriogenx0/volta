import FileUploader from './FileUploader';

export default {
  name: 'FileUploader',
  description: 'A drag-and-drop or click-to-browse file upload area.',
  examples: [
    {
      name: 'File uploader',
      code: '<FileUploader onChange={(file) => console.log(file)} />',
      output: (
        <FileUploader onChange={(file) => {}} />
      )
    },
    {
      name: 'With upload progress',
      code: '<FileUploader fileName="report.pdf" percent={65} />',
      output: (
        <FileUploader fileName="report.pdf" percent={65} />
      )
    },
    {
      name: 'Image files only',
      code: '<FileUploader accept="image/*" onChange={(file) => console.log(file)} />',
      output: (
        <FileUploader accept="image/*" onChange={(file) => {}} />
      )
    },
  ]
};
