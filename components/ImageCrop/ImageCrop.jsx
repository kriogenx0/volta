// Image Crop Component
// Takes a file, returns a file (cropped)

import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button/Button';
import CloseButton from '../CloseButton/CloseButton';
import Icon from '../Icon/Icon';
import Tooltip from '../Tooltip/Tooltip';
import Slider from '../Slider/Slider';

import '../_polyfills/canvas_to_blob';
import './ImageCrop.scss';

export default class ImageCrop extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scale: 1,
      size: { width: 0, height: 0 },
      pos: { x: 0, y: 0 },
      rel: { x: 0, y: 0 },
      visible: false
    };

    // The decoded picture; an Image is not React state, it is set up once and read
    this.element = new Image();

    this.frame = React.createRef();
    this.canvas = React.createRef();

    this.centerImage = this.centerImage.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.setScale = this.setScale.bind(this);
    this.fullSize = this.fullSize.bind(this);
    this.crop = this.crop.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.element.addEventListener('load', this.centerImage);
    this.objectUrl = URL.createObjectURL(this.props.image);
    this.element.src = this.objectUrl;

    this.setState({ filename: this.props.image.name });

    this.showTimer = setTimeout(() => {
      this.setState({ visible: true });
    }, 100);

    document.body.classList.add('bdy', 'is_overlay-visible');
  }

  // If you leave before image loads, abort
  componentWillUnmount() {
    this.element.removeEventListener('load', this.centerImage);

    // Nothing left to fade in or to report closing, and no drag in progress
    clearTimeout(this.showTimer);
    clearTimeout(this.closeTimer);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    URL.revokeObjectURL(this.objectUrl);

    // Allow body scrolling
    document.body.classList.remove('bdy', 'is_overlay-visible');
  }

  // Add and remove event listeners for moving image
  componentDidUpdate(props, state) {
    const moveStarted = this.state.moving && !state.moving;
    const moveStopped = !this.state.moving && state.moving;

    if (moveStarted) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (moveStopped) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  // Center image and constrain
  centerImage(event) {
    if (event) event.preventDefault();

    const canvasWidth = this.props.width;
    const canvasHeight = this.props.height;
    const canvasRatio = canvasWidth / canvasHeight;
    const imageWidth = this.element.width;
    const imageHeight = this.element.height;
    const imageRatio = imageWidth / imageHeight;
    let scale = this.state.scale;

    if (canvasRatio > imageRatio && imageWidth > canvasWidth) {
      scale = canvasWidth / imageWidth;
    }

    if (imageRatio > canvasRatio && imageHeight > canvasHeight) {
      scale = canvasHeight / imageHeight;
    }

    if (scale) {
      this.setState({ scale });
    }

    const pos = {
      x: (canvasWidth - imageWidth * scale) / 2,
      y: (canvasHeight - imageHeight * scale) / 2
    };

    this.setState({
      size: { width: imageWidth, height: imageHeight },
      pos
    });
  }

  // Start moving the image
  startDrag(event) {
    if (event.button !== 0) return; // Left click only

    this.setState({
      moving: true,
      rel: {
        x: event.pageX - this.state.pos.x,
        y: event.pageY - this.state.pos.y
      }
    });

    event.stopPropagation();
    event.preventDefault();
  }

  // Stop moving the image
  onMouseUp(event) {
    this.setState({ moving: false });
    event.stopPropagation();
    event.preventDefault();
  }

  // Update position of image while moving mouse
  onMouseMove(event) {
    if (!this.state.moving) return;

    const x = event.pageX - this.state.rel.x;
    const y = event.pageY - this.state.rel.y;

    this.setState({ pos: this.constrain(x, y) });

    event.stopPropagation();
    event.preventDefault();
  }

  // Keep image on the canvas
  // Pass in scale if the state isn't going to be set in time
  constrain(x, y, scale = this.state.scale) {
    let minX;
    let maxX;
    let minY;
    let maxY;

    if (this.state.size.width * scale > this.props.width) {
      minX = (this.state.size.width * scale - this.props.width) * -1;
      maxX = 0;
    } else {
      minX = 0;
      maxX = this.props.width - this.state.size.width * scale;
    }

    if (this.state.size.height * scale > this.props.height) {
      minY = (this.state.size.height * scale - this.props.height) * -1;
      maxY = 0;
    } else {
      minY = 0;
      maxY = this.props.height - this.state.size.height * scale;
    }

    return {
      x: Math.min(Math.max(x, minX), maxX),
      y: Math.min(Math.max(y, minY), maxY)
    };
  }

  // Scale image, make sure it stays in the frame
  setScale(newScale) {
    const isSmall = this.state.size.width < this.props.width || this.state.size.height < this.props.height;

    if (isSmall && newScale < 1) newScale = 1;

    const oldScale = this.state.scale;
    const oldWidth = this.state.size.width * oldScale;
    const oldHeight = this.state.size.height * oldScale;
    let newWidth = this.state.size.width * newScale;
    let newHeight = this.state.size.height * newScale;

    if (this.props.width > newWidth && !isSmall) {
      newWidth = this.props.width;
      newScale = newWidth / this.state.size.width;
    } else if (this.props.height > newHeight && !isSmall) {
      newHeight = this.props.height;
      newScale = newHeight / this.state.size.height;
    }

    this.setState({ scale: newScale });

    const xMovement = (newWidth - oldWidth) / 2;
    const yMovement = (newHeight - oldHeight) / 2;
    const x = this.state.pos.x - xMovement;
    const y = this.state.pos.y - yMovement;

    this.setState({ pos: this.constrain(x, y, newScale) });
  }

  // Shortcut to full size image
  fullSize(event) {
    if (event) event.preventDefault();
    this.setScale(1);
  }

  // Throw image onto canvas, crop
  crop() {
    const canvas = this.canvas.current;
    const context = canvas.getContext('2d');

    // start with blank white canvas
    context.clearRect(0, 0, this.props.width, this.props.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, this.props.width, this.props.height);

    // draw user image to match framed version
    const dx = this.state.pos.x;
    const dy = this.state.pos.y;
    const dWidth = this.state.size.width * this.state.scale;
    const dHeight = this.state.size.height * this.state.scale;

    context.drawImage(this.element, dx, dy, dWidth, dHeight);

    // return cropped image, named like the original but as a jpg
    canvas.toBlob((blob) => {
      if (!blob) return;
      blob.filename = `${(this.state.filename || 'image').replace(/\.[^.]*$/, '')}.jpg`;
      if (this.props.onCrop) this.props.onCrop(blob);
    }, 'image/jpeg', 0.95);

    // mission complete, close crop dialog
    this.close();
  }

  // Close overlay
  close() {
    this.setState({ visible: false });

    this.closeTimer = setTimeout(() => {
      if (this.props.onClose) this.props.onClose();
    }, 200);
  }

  // Close overlay on click
  handleClose(event) {
    this.close();
    if (event) event.preventDefault();
  }

  render() {
    // Determines the size of the crop area
    const frameStyle = { height: this.props.height, width: this.props.width };

    const controlStyle = this.props.width < 300
      ? { width: 300, marginTop: 30 }
      : { width: this.props.width };

    const screenStyle = { borderWidth: this.props.bleedWidth };

    // Determines size and position of image / ghost image
    const imageStyle = {
      width: this.state.size.width * this.state.scale,
      height: this.state.size.height * this.state.scale,
      left: this.state.pos.x,
      top: this.state.pos.y
    };

    const ghostStyle = { ...imageStyle, backgroundImage: `url(${this.element.src})` };

    const wrapClassName = [
      'volta-image_crop',
      this.state.visible && 'is_visible',
      this.props.width < 400 && 'is_small'
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapClassName} role="dialog" aria-modal="true" aria-label="Position and size image">
        <div className="icr_close">
          <CloseButton onClick={this.handleClose} />
        </div>
        <div className="icr_modal">
          <h2>Position and Size Image</h2>
          <h3>Drag and resize the image within the dimensions as desired.</h3>
          <div ref={this.frame} className="icr_frame" style={frameStyle}>
            <div className="icr_ghost" style={ghostStyle} />
            <div className="icr_window">
              <img className="icr_image" src={this.element.src || undefined} alt="Image being cropped" style={imageStyle} />
              <div className="icr_screen" style={screenStyle} onMouseDown={this.startDrag} />
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
              {this.props.showScale && <Slider ariaLabel="Scale" min={0} max={2} value={this.state.scale} onChange={this.setScale} />}
              <Icon type="image" className="icr_control_range-large" aria-hidden="true" />
            </div>
            <div className="icr_control_size">
              <Tooltip className="icr_control_size_button" title="Center image in the crop area." gravity="down">
                <button type="button" className="icr_control_size_action" aria-label="Center image in the crop area" onClick={this.centerImage}>
                  <Icon type="rectangle.compress.vertical" aria-hidden="true" />
                </button>
              </Tooltip>
              <Tooltip className="icr_control_size_button" title="Show uploaded image's original dimensions." gravity="down">
                <button type="button" className="icr_control_size_action" aria-label="Show original size" onClick={this.fullSize}>
                  <Icon type="rectangle.expand.vertical" aria-hidden="true" />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="icr_btns">
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button variant="primary" onClick={this.crop}>Crop and Save</Button>
          </div>
          <canvas ref={this.canvas} className="icr_canvas" width={this.props.width} height={this.props.height} />
        </div>
      </div>
    );
  }

}

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

ImageCrop.defaultProps = {
  width: 300,
  height: 300,
  bleedWidth: 0,
  showScale: false
};