// Image Crop Component
// Takes a file, returns a file (cropped)

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import CloseButton from '../CloseButton/CloseButton';
import Icon from '../Icon/Icon';
import Tooltip from '../Tooltip/Tooltip';
import Slider from '../Slider/Slider';

import '../_polyfills/canvas_to_blob';
import './ImageCrop.scss';

const ImageCrop = ({ image, width = 300, height = 300, bleedWidth = 0, showScale = false, onClose, onCrop }) => {
  const [scale, setScale] = useState(1);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  // Where the pointer is inside the picture while dragging it
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [moving, setMoving] = useState(false);
  const [visible, setVisible] = useState(false);
  // The object URL the picture is shown from
  const [src, setSrc] = useState(undefined);

  // The decoded picture; an Image is not React state, it is set up once and read
  const [element] = useState(() => new Image());
  const canvas = useRef(null);
  const closeTimer = useRef(null);

  // Center image and constrain
  const centerImage = (event) => {
    if (event) event.preventDefault();

    const canvasRatio = width / height;
    const imageWidth = element.width;
    const imageHeight = element.height;
    const imageRatio = imageWidth / imageHeight;
    let newScale = scale;

    if (canvasRatio > imageRatio && imageWidth > width) {
      newScale = width / imageWidth;
    }

    if (imageRatio > canvasRatio && imageHeight > height) {
      newScale = height / imageHeight;
    }

    if (newScale) {
      setScale(newScale);
    }

    setSize({ width: imageWidth, height: imageHeight });
    setPos({
      x: (width - imageWidth * newScale) / 2,
      y: (height - imageHeight * newScale) / 2
    });
  };

  // Keep image on the canvas
  // Pass in scale if the state isn't going to be set in time
  const constrain = (x, y, forScale = scale) => {
    let minX;
    let maxX;
    let minY;
    let maxY;

    if (size.width * forScale > width) {
      minX = (size.width * forScale - width) * -1;
      maxX = 0;
    } else {
      minX = 0;
      maxX = width - size.width * forScale;
    }

    if (size.height * forScale > height) {
      minY = (size.height * forScale - height) * -1;
      maxY = 0;
    } else {
      minY = 0;
      maxY = height - size.height * forScale;
    }

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  };

  // Start moving the image
  const startDrag = (event) => {
    if (event.button !== 0) return; // Left click only

    setMoving(true);
    setRel({ x: event.pageX - pos.x, y: event.pageY - pos.y });

    event.stopPropagation();
    event.preventDefault();
  };

  // Stop moving the image
  const onMouseUp = (event) => {
    setMoving(false);
    event.stopPropagation();
    event.preventDefault();
  };

  // Update position of image while moving mouse
  const onMouseMove = (event) => {
    if (!moving) return;

    setPos(constrain(event.pageX - rel.x, event.pageY - rel.y));

    event.stopPropagation();
    event.preventDefault();
  };

  // Scale image, make sure it stays in the frame
  const changeScale = (requestedScale) => {
    let newScale = requestedScale;
    const isSmall = size.width < width || size.height < height;

    if (isSmall && newScale < 1) newScale = 1;

    const oldWidth = size.width * scale;
    const oldHeight = size.height * scale;
    let newWidth = size.width * newScale;
    let newHeight = size.height * newScale;

    if (width > newWidth && !isSmall) {
      newWidth = width;
      newScale = newWidth / size.width;
    } else if (height > newHeight && !isSmall) {
      newHeight = height;
      newScale = newHeight / size.height;
    }

    setScale(newScale);

    const xMovement = (newWidth - oldWidth) / 2;
    const yMovement = (newHeight - oldHeight) / 2;
    setPos(constrain(pos.x - xMovement, pos.y - yMovement, newScale));
  };

  // Shortcut to full size image
  const fullSize = (event) => {
    if (event) event.preventDefault();
    changeScale(1);
  };

  // Close overlay
  const close = () => {
    setVisible(false);

    closeTimer.current = setTimeout(() => {
      if (latest.current.onClose) latest.current.onClose();
    }, 200);
  };

  // Close overlay on click
  const handleClose = (event) => {
    close();
    if (event) event.preventDefault();
  };

  // Throw image onto canvas, crop
  const crop = () => {
    const canvasEl = canvas.current;
    const context = canvasEl.getContext('2d');

    // start with blank white canvas
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // draw user image to match framed version
    context.drawImage(element, pos.x, pos.y, size.width * scale, size.height * scale);

    // return cropped image, named like the original but as a jpg
    canvasEl.toBlob((blob) => {
      if (!blob) return;
      blob.filename = `${(image.name || 'image').replace(/\.[^.]*$/, '')}.jpg`;
      if (onCrop) onCrop(blob);
    }, 'image/jpeg', 0.95);

    // mission complete, close crop dialog
    close();
  };

  // What the listeners and timers below call is the latest of these, as they outlive a render
  const latest = useRef({});
  latest.current = { centerImage, onMouseMove, onMouseUp, onClose };

  // On mount: center the picture once it has loaded, fade in, and lock page scrolling.
  // If you leave before the image loads, nothing is left running.
  useEffect(() => {
    const onLoad = (event) => latest.current.centerImage(event);
    element.addEventListener('load', onLoad);

    const showTimer = setTimeout(() => setVisible(true), 100);

    document.body.classList.add('bdy', 'is_overlay-visible');

    return () => {
      element.removeEventListener('load', onLoad);

      // Nothing left to fade in or to report closing
      clearTimeout(showTimer);
      clearTimeout(closeTimer.current);

      // Allow body scrolling
      document.body.classList.remove('bdy', 'is_overlay-visible');
    };
  }, [element]);

  // Show the picture from an object URL, released when it is replaced or the cropper leaves
  useEffect(() => {
    const objectUrl = URL.createObjectURL(image);
    element.src = objectUrl;
    setSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image, element]);

  // Listen to the mouse on the whole page while the picture is being dragged
  useEffect(() => {
    if (!moving) return undefined;

    const move = (event) => latest.current.onMouseMove(event);
    const up = (event) => latest.current.onMouseUp(event);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
  }, [moving]);

  // Determines the size of the crop area
  const frameStyle = { height, width };

  const controlStyle = width < 300
    ? { width: 300, marginTop: 30 }
    : { width };

  const screenStyle = { borderWidth: bleedWidth };

  // Determines size and position of image / ghost image
  const imageStyle = {
    width: size.width * scale,
    height: size.height * scale,
    left: pos.x,
    top: pos.y
  };

  const ghostStyle = { ...imageStyle, backgroundImage: src ? `url(${src})` : undefined };

  const wrapClassName = [
    'volta-image_crop',
    visible && 'is_visible',
    width < 400 && 'is_small'
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapClassName} role="dialog" aria-modal="true" aria-label="Position and size image">
      <div className="icr_close">
        <CloseButton onClick={handleClose} />
      </div>
      <div className="icr_modal">
        <h2>Position and Size Image</h2>
        <h3>Drag and resize the image within the dimensions as desired.</h3>
        <div className="icr_frame" style={frameStyle}>
          <div className="icr_ghost" style={ghostStyle} />
          <div className="icr_window">
            <img className="icr_image" src={src} alt="Image being cropped" style={imageStyle} />
            <div className="icr_screen" style={screenStyle} onMouseDown={startDrag} />
          </div>
          <div className="icr_guide is_vert is_left"></div>
          <div className="icr_guide is_vert is_center"></div>
          <div className="icr_guide is_vert is_right"></div>
          <div className="icr_guide is_horiz is_top"></div>
          <div className="icr_guide is_horiz is_middle"></div>
          <div className="icr_guide is_horiz is_bottom"></div>
        </div>
        <div className="icr_control" style={controlStyle}>
          <div className="icr_control_range">
            <Icon type="image" size="small" className="icr_control_range-small" aria-hidden="true" />
            {showScale && <Slider ariaLabel="Scale" min={0} max={2} value={scale} onChange={changeScale} />}
            <Icon type="image" className="icr_control_range-large" aria-hidden="true" />
          </div>
          <div className="icr_control_size">
            <Tooltip className="icr_control_size_button" title="Center image in the crop area." gravity="down">
              <button type="button" className="icr_control_size_action" aria-label="Center image in the crop area" onClick={centerImage}>
                <Icon type="rectangle.compress.vertical" aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip className="icr_control_size_button" title="Show uploaded image's original dimensions." gravity="down">
              <button type="button" className="icr_control_size_action" aria-label="Show original size" onClick={fullSize}>
                <Icon type="rectangle.expand.vertical" aria-hidden="true" />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="icr_btns">
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={crop}>Crop and Save</Button>
        </div>
        <canvas ref={canvas} className="icr_canvas" width={width} height={height} />
      </div>
    </div>
  );
};

ImageCrop.propTypes = {
  // The File (or Blob) to crop
  image: PropTypes.instanceOf(Blob).isRequired,
  // Size in pixels of the cropped image
  width: PropTypes.number,
  height: PropTypes.number,
  // Width of the dimmed border shown around the crop area
  bleedWidth: PropTypes.number,
  // Show the drag-to-scale slider between the size icons (ImageUploader does)
  showScale: PropTypes.bool,
  // Called after the cropper has faded out, whether it was cancelled or saved
  onClose: PropTypes.func,
  // Called with the cropped jpg Blob, which also has a `filename`
  onCrop: PropTypes.func
};

export default ImageCrop;
