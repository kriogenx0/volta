import FileManager from '../../components/FileManager/FileManager';

const sampleFiles = [
  { name: 'project-brief.pdf', type: 'application/pdf', size: 204800 },
  { name: 'screenshot.png', type: 'image/png', size: 512000 },
  { name: 'data-export.csv', type: 'text/csv', size: 102400 },
];

export default {
  name: 'FileManager',
  description: 'A file browser component with path navigation.',
  examples: [
    {
      name: 'File manager',
      code: `<FileManager
  files={files}
  path="/"
  onFileSelect={(file) => console.log(file)}
  onPathBack={() => {}}
/>`,
      output: (
        <FileManager
          files={sampleFiles}
          path="/"
          onFileSelect={(file) => {}}
          onPathBack={() => {}}
        />
      )
    },
  ]
};
