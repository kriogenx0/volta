import { useState } from 'react';

import FileManager from '../../components/FileManager/FileManager';

// A small fake file system: every folder lists its contents, and a name ending
// in "/" is a folder.
const TREE = {
  '': ['documents/', 'photos/', 'notes.txt', 'budget.csv'],
  documents: ['contracts/', 'project-brief.pdf', 'meeting-notes.md'],
  'documents/contracts': ['lease.pdf', 'nda.pdf'],
  photos: ['screenshot.png', 'headshot.jpg']
};

const SAMPLE_FILES = TREE[''];

// Opening a folder goes down a level and back goes up one
const Browser = () => {
  const [path, setPath] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleSelect = (file) => {
    if (file.endsWith('/')) {
      setPath([...path, file.slice(0, -1)]);
      setSelected(null);
    } else {
      setSelected(file);
    }
  };

  return (
    <div className="example-stack">
      <FileManager
        files={TREE[path.join('/')]}
        path={path}
        onFileSelect={handleSelect}
        onPathBack={path.length > 0 ? () => setPath(path.slice(0, -1)) : undefined}
      />
      <p>{selected ? `Selected ${selected}` : 'Open a folder or pick a file.'}</p>
    </div>
  );
};

export default {
  name: 'FileManager',
  description: 'A browser for one folder at a time. Give it the file names to list (folders end in a slash) and the path leading to them; it calls onFileSelect with the name clicked and onPathBack for the back button, and leaves the navigation to you.',
  examples: [
    {
      name: 'Browsing folders',
      code: `const [path, setPath] = useState([]);

<FileManager
  files={listFolder(path)}
  path={path}
  onFileSelect={(file) => file.endsWith('/') ? setPath([...path, file.slice(0, -1)]) : open(file)}
  onPathBack={path.length > 0 ? () => setPath(path.slice(0, -1)) : undefined}
/>`,
      output: <Browser />
    },
    {
      name: 'Files and folders',
      code: `<FileManager
  files={['documents/', 'photos/', 'notes.txt', 'budget.csv']}
  path="/"
  onFileSelect={(file) => console.log(file)}
  onPathBack={() => {}}
/>`,
      output: (
        <FileManager
          files={SAMPLE_FILES}
          path="/"
          onFileSelect={() => {}}
          onPathBack={() => {}}
        />
      )
    },
    {
      name: 'Nested path',
      code: `<FileManager
  files={['lease.pdf', 'nda.pdf']}
  path={['documents', 'contracts']}
  onFileSelect={(file) => console.log(file)}
  onPathBack={() => {}}
/>`,
      output: (
        <FileManager
          files={TREE['documents/contracts']}
          path={['documents', 'contracts']}
          onFileSelect={() => {}}
          onPathBack={() => {}}
        />
      )
    },
    {
      name: 'Loading',
      code: '<FileManager loadingFiles path={[\'documents\']} onPathBack={() => {}} />',
      output: <FileManager loadingFiles path={['documents']} onPathBack={() => {}} />
    },
    {
      name: 'Empty folder',
      code: '<FileManager files={[]} path={[\'photos\']} onPathBack={() => {}} />',
      output: <FileManager files={[]} path={['photos']} onPathBack={() => {}} />
    }
  ]
};
