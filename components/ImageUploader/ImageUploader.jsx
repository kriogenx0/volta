// Image Picker Component ties together File Picker and Image Crop components
import { useState, useEffect } from 'react';

import Layer from '../Layer/Layer';
import ImageCrop from './ImageCrop';

const ImageUploader = ({ shouldPick, cropWidth, cropHeight, bleedWidth, onImagePick, className, children }) => {
  const [file, setFile] = useState(null);

  const selectFile = (callback, options) => {
    options = options || { multiple: false, accept: null };
    const input = document.createElement('input');
    input.type = "file";

    if (options.multiple) input.multiple = true;

    if (options.accept) input.accept = options.accept;

    const handleFileSelect = (event) => {
      if (typeof callback == 'function')
        callback(options.multiple ? event.target.files : event.target.files[0]);

      input.removeEventListener('change', handleFileSelect);
    }

    input.addEventListener('change', handleFileSelect);

    input.click();
  };

  const handleFileSelect = () => {
    selectFile(
      (file) => {
        setFile(file);
      },
      { accept: 'image/*' }
    );
  };

  useEffect(() => {
    if (shouldPick) handleFileSelect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPick]);

  const handleClose = () => {
    setFile(null);
  };

  // ImageCrop returns a file blob.
  const handleCrop = (blob) => {
    // Create an object URL so we can see the image
    const newImg = document.createElement('img');
    const url = URL.createObjectURL(blob);

    // Cleanup
    newImg.onload = () => {
      URL.revokeObjectURL(url);
    };

    // Load the image to trigger the cleanup
    newImg.src = url;

    // Return blob and URL for convenience
    onImagePick(blob, url);
    handleClose();
  };

  return (
    <div onClick={handleFileSelect} className={['volta-image_uploader', className].filter(Boolean).join(' ')}>
      {children}
      {file && (
        <Layer>
          <ImageCrop
            image={file}
            width={cropWidth}
            height={cropHeight}
            bleedWidth={bleedWidth}
            onClose={handleClose}
            onCrop={handleCrop}
          />
        </Layer>
      )}
    </div>
  );
};

export default ImageUploader;
