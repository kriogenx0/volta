// Image Picker Component ties together File Picker and Image Crop components
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Layer from '../Layer/Layer';
import ImageCrop from '../ImageCrop/ImageCrop';

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

  // Open the picker when shouldPick turns true, not on every render.
  useEffect(() => {
    if (shouldPick) handleFileSelect();
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

  // The crop Layer is a sibling of the clickable wrapper, not a child: React
  // events bubble through portals, so clicks inside the cropper (Cancel, Crop
  // and Save, the scale slider) would otherwise reopen the file picker.
  return (
    <>
      <div onClick={handleFileSelect} className={['volta-image_uploader', className].filter(Boolean).join(' ')}>
        {children}
      </div>
      {file && (
        <Layer>
          <ImageCrop
            image={file}
            width={cropWidth}
            height={cropHeight}
            bleedWidth={bleedWidth}
            showScale
            onClose={handleClose}
            onCrop={handleCrop}
          />
        </Layer>
      )}
    </>
  );
};

ImageUploader.propTypes = {
  // Set to true to open the file picker without a click on the children.
  shouldPick: PropTypes.bool,
  // Size in pixels of the cropped image.
  cropWidth: PropTypes.number.isRequired,
  cropHeight: PropTypes.number.isRequired,
  // Width of the dimmed border shown around the crop area.
  bleedWidth: PropTypes.number,
  // Called with the cropped image Blob (and an object URL for it).
  onImagePick: PropTypes.func.isRequired,
  className: PropTypes.string,
  // What to click on to start picking: a button, an avatar, a placeholder.
  children: PropTypes.node
};

export default ImageUploader;
