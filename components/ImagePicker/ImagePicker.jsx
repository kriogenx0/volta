import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import './ImagePicker.scss';

const ImagePicker = ({ height, className, defaultImageUrl, accept, onChange }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const imageSelected = useRef(false);

  // fileBlob or imageUrl or base64
  const loadImage = useCallback((fileBlob) => {
    if (typeof fileBlob == 'object') {
      setImageUrl('');
      setLoading(true);

      if (!FileReader) {
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
    let file = event.target.files;
    // TODO support for multiple
    if (file instanceof FileList) {
      file = file[0];
    }
    if (!file) return;

    imageSelected.current = true;
    loadImage(file);
    onChange(file);
  };

  const handleRemove = (e) => {
    if (e) e.preventDefault();
    imageSelected.current = false;
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
        <div className='image_picker-remove' onClick={handleRemove}>
          <i className='fa fa-trash' />
        </div>
        : null
      }
      <input type='file' onChange={handleFileSelect} accept={accept} />
      <div className='image_background' style={imageStyle}>
        {loading
          ? (<i className='fa fa-circle-o-notch' />)
          : (!imageUrl ? (<i className='icon fa fa-cloud-upload' />) : null)}
      </div>
    </div>
  );
};

ImagePicker.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  defaultImageUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onChange: PropTypes.func
};

ImagePicker.defaultProps = {
  height: 300,
  className: null,
  defaultImageUrl: null,
  accept: 'image/*',
  onChange: (fileBlob, imageUrl) => {}
};

export default ImagePicker;
