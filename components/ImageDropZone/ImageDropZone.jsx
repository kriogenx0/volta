import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const ImageDropZone = ({ height, className, selectFileOnMount, defaultImageUrl, onChange }) => {
  const [imageUrl, setImageUrl] = useState(defaultImageUrl || null);

  const selectFile = (callback, options) => {
    options = options || { multiple: false, accept: null };

    // Create Input
    const input = document.createElement('input');
    input.type = 'file';
    if (options.multiple) input.multiple = true;
    if (options.accept) input.accept = options.accept;

    const handleChange = (event) => {
      if (typeof callback == 'function') {
        callback(options.multiple ? event.target.files : event.target.files[0]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectFileOnMount]);

  const imageStyle = {
    backgroundImage: imageUrl ? `url(${imageUrl})` : null,
    height
  };

  return (
    <div className={'volta-image_drop_zone ' + className} onClick={handleFileSelect}>
      <div className='image_background' style={imageStyle} />
    </div>
  );
};

ImageDropZone.propTypes = {
  height: PropTypes.number,
  className: PropTypes.string,
  selectFileOnMount: PropTypes.bool,
  defaultImageUrl: PropTypes.string,
  onChange: PropTypes.func
};

ImageDropZone.defaultProps = {
  height: 300,
  className: null,
  selectFileOnMount: false,
  defaultImageUrl: null,
  onChange: (fileBlob, imageUrl) => {}
};

export default ImageDropZone;
