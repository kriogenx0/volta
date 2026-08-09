import FilePicker from './FilePicker';

export default {
  name: 'FilePicker',
  description: 'A button that opens a file browser dialog.',
  examples: [
    {
      name: 'File picker',
      code: '<FilePicker onChange={(file) => console.log(file)} />',
      output: (
        <FilePicker onChange={(file) => {}} />
      )
    },
    {
      name: 'Custom label',
      code: '<FilePicker buttonLabel="Choose Image" fileType="image" onChange={(file) => console.log(file)} />',
      output: (
        <FilePicker buttonLabel="Choose Image" fileType="image" onChange={(file) => {}} />
      )
    },
    {
      name: 'Multiple files',
      code: '<FilePicker multiple onChange={(files) => console.log(files)} />',
      output: (
        <FilePicker multiple onChange={(files) => {}} />
      )
    },
  ]
};
