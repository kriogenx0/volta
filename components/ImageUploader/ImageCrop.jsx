// Image Crop Component
// Takes a file, returns a file (cropped)

import React from 'react';

import Tooltip from '../Tooltip/Tooltip';

import './canvas_toblob';
import ScaleSlider from './ScaleSlider';
import '../ImageCrop/ImageCrop.scss';

export default class ImageCrop extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scale: 1,
      element: new Image(),
      size: { width: 0, height: 0 },
      pos: { x: 0, y: 0 },
      rel: { x: 0, y: 0 },
      visible: false
    };

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
    this.state.element.addEventListener('load', this.centerImage);
    this.state.element.src = URL.createObjectURL(this.props.image);

    this.setState({ filename: this.props.image.name });

    setTimeout(() => {
      this.setState({ visible: true });
    }, 100);

    document.body.classList.add('bdy', 'is_overlay-visible');
  }

  // If you leave before image loads, abort
  componentWillUnmount() {
    this.state.element.removeEventListener('load', this.centerImage);

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
    const imageWidth = this.state.element.width;
    const imageHeight = this.state.element.height;
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

    context.drawImage(this.state.element, dx, dy, dWidth, dHeight);

    // return cropped image
    canvas.toBlob((blob) => {
      blob.filename = `${this.state.filename.substr(0, this.state.filename.lastIndexOf('.'))}.jpg`;
      this.props.onCrop(blob);
    }, 'image/jpeg', 0.95);

    // mission complete, close crop dialog
    this.close();
  }

  // Close overlay
  close() {
    this.setState({ visible: false });

    setTimeout(() => {
      this.props.onClose();
    }, 200);
  }

  // Close overlay on click
  handleClose(event) {
    this.close();
    event.preventDefault();
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

    const ghostStyle = { ...imageStyle, backgroundImage: `url(${this.state.element.src})` };

    const wrapClassName = [
      'volta-image_crop',
      this.state.visible && 'is_visible',
      this.props.width < 400 && 'is_small'
    ].filter(Boolean).join(' ');

    return (
      <div className={wrapClassName}>
        <div className="icr_close" onClick={this.handleClose}></div>
        <div className="icr_modal">
          <h2>Position and Size Image</h2>
          <h3>Drag and resize the image within the dimensions as desired.</h3>
          <div ref={this.frame} className="icr_frame" style={frameStyle}>
            <div className="icr_ghost" style={ghostStyle} />
            <div className="icr_window">
              <img className="icr_image" src={this.state.element.src} style={imageStyle} />
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
              <i className="icn icn-image-size-small" />
              <i className="icn icn-image-size-large" />
              <ScaleSlider min={0} max={2} value={this.state.scale} onChange={this.setScale} />
            </div>
            <div className="icr_control_size">
              <Tooltip className="icr_control_size_button cursor-pointer" onClick={this.centerImage} title="Center image in the crop area." gravity="down">
                <i className="icn icn-image-size-reset l-v-align-middle" />
              </Tooltip>
              <Tooltip className="icr_control_size_button cursor-pointer" onClick={this.fullSize} title="Show uploaded image's original dimensions." gravity="down">
                <i className="icn icn-image-size-original l-v-align-middle" />
              </Tooltip>
            </div>
          </div>
          <div className="icr_btns">
            <button type="button" className="btn" onClick={this.handleClose}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={this.crop}>Crop and Save</button>
          </div>
          <canvas ref={this.canvas} className="icr_canvas" width={this.props.width} height={this.props.height} />
        </div>
      </div>
    );
  }

}
