import { useEffect, useState } from 'react';

import ImageUploader from '../../components/ImageUploader/ImageUploader';
import Button from '../../components/Button/Button';

// Shows the picked image under the trigger. ImageUploader revokes the object URL
// it hands to onImagePick as soon as it has loaded it, so the preview makes its
// own URL from the blob and revokes it when replaced or unmounted.
const Preview = ({ cropWidth, cropHeight, bleedWidth, className, label = 'Choose image' }) => {
  const [picked, setPicked] = useState(null);

  useEffect(() => () => {
    if (picked) URL.revokeObjectURL(picked.url);
  }, [picked]);

  const handlePick = (blob) => setPicked({ url: URL.createObjectURL(blob), name: blob.filename });

  return (
    <div className="example-stack">
      <ImageUploader cropWidth={cropWidth} cropHeight={cropHeight} bleedWidth={bleedWidth} className={className} onImagePick={handlePick}>
        <Button>{label}</Button>
      </ImageUploader>
      {picked
        ? <img src={picked.url} alt={`Cropped upload ${picked.name}`} width={Math.min(cropWidth, 320)} />
        : <p>Nothing picked yet. The cropped image appears here.</p>}
    </div>
  );
};

// shouldPick opens the picker from code. Resetting it straight away lets the
// next click open the picker again, even after a cancelled dialog.
const PickFromCode = () => {
  const [pick, setPick] = useState(false);
  const [name, setName] = useState(null);

  useEffect(() => {
    if (pick) setPick(false);
  }, [pick]);

  return (
    <div className="example-stack">
      <Button onClick={() => setPick(true)}>Add a cover photo</Button>
      <ImageUploader shouldPick={pick} cropWidth={480} cropHeight={270} onImagePick={(blob) => setName(blob.filename)} />
      <p>{name ? `Picked ${name}` : 'Nothing picked yet.'}</p>
    </div>
  );
};

export default {
  name: 'ImageUploader',
  description: 'Wraps whatever you pass as children (a button, an avatar) so clicking it opens the browser file picker for an image, then shows a cropper that resizes it to cropWidth by cropHeight. onImagePick gets the cropped JPEG as a Blob. Pass a focusable child such as a button so keyboard users can start it.',
  examples: [
    {
      name: 'Button that picks and crops',
      code: `<ImageUploader
  cropWidth={400}
  cropHeight={300}
  onImagePick={(blob) => setImage(blob)}
>
  <Button>Choose image</Button>
</ImageUploader>`,
      output: <Preview cropWidth={400} cropHeight={300} />
    },
    {
      name: 'Square profile photo',
      code: `<ImageUploader cropWidth={200} cropHeight={200} onImagePick={handlePick}>
  <Button>Change photo</Button>
</ImageUploader>`,
      output: <Preview cropWidth={200} cropHeight={200} label="Change photo" />
    },
    {
      name: 'Wide banner with a bleed border',
      code: `<ImageUploader
  cropWidth={640}
  cropHeight={200}
  bleedWidth={40}
  className="banner_picker"
  onImagePick={handlePick}
>
  <Button>Upload banner</Button>
</ImageUploader>`,
      output: <Preview cropWidth={640} cropHeight={200} bleedWidth={40} className="banner_picker" label="Upload banner" />
    },
    {
      name: 'Open the picker from code',
      code: `// shouldPick turns true -> the picker opens, with no click on the children.
<Button onClick={() => setPick(true)}>Add a cover photo</Button>
<ImageUploader shouldPick={pick} cropWidth={480} cropHeight={270} onImagePick={handlePick} />`,
      output: <PickFromCode />
    }
  ]
};
