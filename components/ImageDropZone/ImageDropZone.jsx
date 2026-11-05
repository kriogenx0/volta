import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import './ImageDropZone.scss';

// A box that shows an image and takes a new one on a click (opens the file
// picker) or a drop. onChange gets the File and its data URL once it is read.
const ImageDropZone = ({
  height = 300,
  className = null,
  selectFileOnMount = false,
  defaultImageUrl = null,
  onChange = () => {}
}) => {
  const [imageUrl, setImageUrl] = useState(defaultImageUrl || null);
  const [dragging, setDragging] = useState(false);
  const picked = useRef(false);

  // A default image that arrives later shows up, unless a file was chosen first
  useEffect(() => {
    if (!picked.current) setImageUrl(defaultImageUrl || null);
  }, [defaultImageUrl]);

  const selectFile = (callback, options) => {
    options = options || { multiple: false, accept: null };

    // Create Input
    const input = document.createElement('input');
    input.type = 'file';
    if (options.multiple) input.multiple = true;
    if (options.accept) input.accept = options.accept;

    const handleChange = (event) => {
      const files = event.target.files;
      // Nothing was chosen
      if (!files || files.length === 0) return;
      if (typeof callback == 'function') {
        callback(options.multiple ? files : files[0]);
      }
      input.removeEventListener('change', handleChange);
    }
    input.addEventListener('change', handleChange);
    input.click();
  };

  const selectFileCallback = useCallback((file) => {
    // Read file properties
    var reader = new FileReader();
    reader.onload = (e) => {
      picked.current = true;
      onChange(file, e.target.result);
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleFileSelect = useCallback(() => {
    selectFile(selectFileCallback, { accept: 'image/*' });
  }, [selectFileCallback]);

  useEffect(() => {
    if (selectFileOnMount) handleFileSelect();
  }, [selectFileOnMount]);

  // Dropping needs the dragover default cancelled, or the browser opens the file
  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer && event.dataTransfer.files[0];
    if (file && /^image\//.test(file.type)) selectFileCallback(file);
  };

  const imageStyle = {
    backgroundImage: imageUrl ? `url("${imageUrl}")` : null,
    height
  };

  const classes = ['volta-image_drop_zone', dragging && 'volta-image_drop_zone--dragging', className]
    .filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-label={imageUrl ? 'Change image' : undefined}
      onClick={handleFileSelect}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <span className='image_background' style={imageStyle} />
      {!imageUrl && <span className='image_drop_zone-hint'>Click or drop an image</span>}
    </button>
  );
};

ImageDropZone.propTypes = {
  // Height of the box in pixels
  height: PropTypes.number,
  className: PropTypes.string,
  // Open the file picker as soon as the zone mounts (browsers may ignore it
  // without a recent click)
  selectFileOnMount: PropTypes.bool,
  // An image to show until one is chosen
  defaultImageUrl: PropTypes.string,
  // Called with the chosen File and its data URL
  onChange: PropTypes.func
};

export default ImageDropZone;
