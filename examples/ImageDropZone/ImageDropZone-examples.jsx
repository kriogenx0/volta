import { useState } from 'react';

import ImageDropZone from '../../components/ImageDropZone/ImageDropZone';

// A small inline SVG, so the "existing image" example works offline.
const SAMPLE_IMAGE = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">'
  + '<rect width="600" height="300" fill="lightsteelblue"/>'
  + '<circle cx="450" cy="90" r="40" fill="gold"/>'
  + '<path d="M0 300 L170 120 L300 240 L400 160 L600 300 Z" fill="slategray"/>'
  + '</svg>'
);

// Shows what onChange hands back: the File and its data URL.
const DropZoneWithFeedback = () => {
  const [file, setFile] = useState(null);

  return (
    <div className="example-stack">
      <ImageDropZone height={200} onChange={(chosen) => setFile(chosen)} />
      <p>{file ? `Chosen: ${file.name} (${file.size} bytes)` : 'No image chosen yet.'}</p>
    </div>
  );
};

export default {
  name: 'ImageDropZone',
  description: 'A box for choosing one image. Click it to open the file picker, or drop an image file on it; the picture then fills the box and onChange gets the File and its data URL. Give it defaultImageUrl to start with a picture.',
  examples: [
    {
      name: 'Empty',
      code: '<ImageDropZone height={160} />',
      output: <ImageDropZone height={160} />
    },
    {
      name: 'Reporting the chosen file',
      code: `const [file, setFile] = useState(null);

<ImageDropZone height={200} onChange={(chosen) => setFile(chosen)} />
<p>{file ? \`Chosen: \${file.name} (\${file.size} bytes)\` : 'No image chosen yet.'}</p>`,
      output: <DropZoneWithFeedback />
    },
    {
      name: 'Starting with an image',
      code: '<ImageDropZone height={200} defaultImageUrl={imageUrl} />',
      output: <ImageDropZone height={200} defaultImageUrl={SAMPLE_IMAGE} />
    },
    {
      name: 'Custom height and class',
      code: '<ImageDropZone height={80} className="profile-banner" />',
      output: <ImageDropZone height={80} className="profile-banner" />
    }
  ]
};
