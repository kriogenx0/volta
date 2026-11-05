import { useState } from 'react';

import Button from '../../components/Button/Button';
import ImageCrop from '../../components/ImageCrop/ImageCrop';

// A real, decodable picture built here (a drawn landscape), so the cropper has
// something to show without a network or an upload.
const LANDSCAPE = new File([
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">'
  + '<rect width="800" height="600" fill="#9ec5e8"/>'
  + '<circle cx="620" cy="140" r="70" fill="#ffd54f"/>'
  + '<path d="M0 600V380l160-140 140 120 150-200 200 220 150-120v340z" fill="#5b7a99"/>'
  + '<path d="M0 600V470l200-90 180 70 200-110 220 120v140z" fill="#355269"/>'
  + '<rect x="360" y="270" width="80" height="80" fill="none" stroke="#fff" stroke-width="6"/>'
  + '</svg>'
], 'landscape.svg', { type: 'image/svg+xml' });

// The cropper covers the whole page, so each example is a button that opens it.
// onCrop gets the cropped Blob; onClose runs once the cropper has faded out.
const CropDemo = ({ label = 'Open cropper', ...cropProps }) => {
  const [open, setOpen] = useState(false);
  const [cropped, setCropped] = useState(null);

  return (
    <div className="example-stack">
      <div>
        <Button onClick={() => setOpen(true)}>{label}</Button>
      </div>
      <p>{cropped ? `Cropped to ${cropped.filename} (${cropped.size} bytes).` : 'Nothing cropped yet.'}</p>
      {open && (
        <ImageCrop
          image={LANDSCAPE}
          onCrop={setCropped}
          onClose={() => setOpen(false)}
          {...cropProps}
        />
      )}
    </div>
  );
};

export default {
  name: 'ImageCrop',
  description: 'A full-screen cropper for one image file. Drag the picture to position it, resize it with the scale slider or the size buttons, then Crop and Save hands onCrop a jpg Blob of exactly width by height pixels. The examples open it from a button because it covers the page.',
  examples: [
    {
      name: 'Square crop',
      code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open cropper</Button>
{open && (
  <ImageCrop
    image={file}
    width={300}
    height={300}
    onCrop={(blob) => upload(blob)}
    onClose={() => setOpen(false)}
  />
)}`,
      output: <CropDemo width={300} height={300} />
    },
    {
      name: 'With the scale slider',
      code: `<ImageCrop
  image={file}
  width={400}
  height={250}
  showScale
  onCrop={(blob) => upload(blob)}
  onClose={() => setOpen(false)}
/>`,
      output: <CropDemo label="Open cropper with a slider" width={400} height={250} showScale />
    },
    {
      name: 'Wide banner with a bleed',
      code: `<ImageCrop
  image={file}
  width={640}
  height={200}
  bleedWidth={24}
  showScale
  onCrop={(blob) => upload(blob)}
  onClose={() => setOpen(false)}
/>`,
      output: <CropDemo label="Open banner cropper" width={640} height={200} bleedWidth={24} showScale />
    },
    {
      name: 'Small avatar crop',
      code: `<ImageCrop
  image={file}
  width={160}
  height={160}
  showScale
  onCrop={(blob) => upload(blob)}
  onClose={() => setOpen(false)}
/>`,
      output: <CropDemo label="Open avatar cropper" width={160} height={160} showScale />
    }
  ]
};
