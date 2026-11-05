import { useState } from 'react';

import ImagePicker from '../../components/ImagePicker/ImagePicker';

// A small inline SVG, so the "existing image" example works offline.
const SAMPLE_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">' +
  '<rect width="600" height="300" fill="lightsteelblue"/>' +
  '<circle cx="450" cy="90" r="40" fill="gold"/>' +
  '<path d="M0 300 L170 120 L300 240 L400 160 L600 300 Z" fill="slategray"/>' +
  '</svg>'
);

// Shows what onChange hands back: the chosen File, or null once it is removed.
const ImagePickerWithFeedback = () => {
  const [file, setFile] = useState(null);

  return (
    <div className="example-stack">
      <ImagePicker height={200} onChange={setFile} />
      <p>{file ? `Selected: ${file.name} (${file.size} bytes)` : 'No image selected.'}</p>
    </div>
  );
};

export default {
  name: 'ImagePicker',
  description: 'Click or drop a file on the box to choose an image and preview it in place. A trash button appears over the preview to remove it again; onChange gets the File, or null on removal.',
  examples: [
    {
      name: 'Empty',
      code: '<ImagePicker />',
      output: <ImagePicker />
    },
    {
      name: 'With an existing image',
      code: (
        '// photoUrl is any image URL or data URI\n' +
        '<ImagePicker defaultImageUrl={photoUrl} />'
      ),
      output: <ImagePicker defaultImageUrl={SAMPLE_IMAGE} />
    },
    {
      name: 'Custom height and accepted types',
      code: '<ImagePicker height={160} accept="image/png, image/jpeg" />',
      output: <ImagePicker height={160} accept="image/png, image/jpeg" />
    },
    {
      name: 'With onChange',
      code: (
        'const [file, setFile] = useState(null);\n\n' +
        '<ImagePicker height={200} onChange={setFile} />\n' +
        "<p>{file ? `Selected: ${file.name}` : 'No image selected.'}</p>"
      ),
      output: <ImagePickerWithFeedback />
    }
  ]
};
