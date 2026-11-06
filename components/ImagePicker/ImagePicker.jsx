import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

import './ImagePicker.scss';

const ImagePicker = ({
  height = 300,
  className = null,
  defaultImageUrl = null,
  accept = 'image/*',
  onChange = () => {}
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageSelected = useRef(false);
  const fileInput = useRef(null);

  // fileBlob or imageUrl or base64
  const loadImage = useCallback((fileBlob) => {
    if (typeof fileBlob == 'object') {
      setImageUrl('');
      setLoading(true);

      if (typeof FileReader === 'undefined') {
        console.error('Browser not supported.');
        setLoading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageEncoded = e.target.result;
        setImageUrl(imageEncoded);
        setLoading(false);
      };
      reader.onerror = () => setLoading(false);
      reader.readAsDataURL(fileBlob);
    } else {
      setImageUrl(fileBlob);
    }
  }, []);

  useEffect(() => {
    if (defaultImageUrl && !imageSelected.current) {
      loadImage(defaultImageUrl);
    }
  }, [defaultImageUrl, loadImage]);

  const handleFileSelect = (event) => {
    const { files } = event.target;
    // TODO support for multiple
    const file = files && typeof files.length === 'number' ? files[0] : files;
    if (!file) return;

    imageSelected.current = true;
    loadImage(file);
    onChange(file);
  };

  const handleRemove = (e) => {
    if (e) e.preventDefault();
    imageSelected.current = false;
    // Clear the input too, or picking the same file again wouldn't fire a change.
    if (fileInput.current) fileInput.current.value = '';
    setImageUrl(null);
    onChange(null);
  };

  const imageStyle = {
    backgroundImage: imageUrl ? `url('${imageUrl}')` : '',
    height
  };

  return (
    // ironyoung-compat: c-image_picker is the class name its own view-level scss targets directly.
    <div className={'volta-image_picker c-image_picker' + (className ? ` ${className}` : '')} >
      { imageUrl ?
        <button type='button' className='image_picker-remove' onClick={handleRemove} aria-label='Remove image'>
          <Icon type='trash' aria-hidden='true' />
        </button>
        : null
      }
      <input ref={fileInput} type='file' onChange={handleFileSelect} accept={accept} aria-label='Choose an image' />
      <div className='image_background' style={imageStyle}>
        {loading
          ? (<Icon type='spinner' aria-hidden='true' />)
          : (!imageUrl ? (<Icon type='cloud-upload' aria-hidden='true' />) : null)}
      </div>
    </div>
  );
};

ImagePicker.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  // An image URL (or data URI), or a File/Blob.
  defaultImageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // Passed to the file input's `accept`.
  accept: PropTypes.string,
  // Called with the chosen File, or null when the image is removed.
  onChange: PropTypes.func
};

export default ImagePicker;
