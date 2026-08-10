// Image Picker Component ties together File Picker and Image Crop components
import React from 'react';

import Layer from '../Layer/Layer';
import ImageCrop from './ImageCrop';

export default class ImageUploader extends React.Component {

  constructor(props) {
    super(props);
    this.state = { file: null };

    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCrop = this.handleCrop.bind(this);
  }

  selectFile(callback, options) {
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
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldPick && !prevProps.shouldPick) {
      this.handleFileSelect();
    }
  }

  handleFileSelect() {
    this.selectFile(
      (file) => {
        this.setState({ file });
      },
      { accept: 'image/*' }
    );
  }

  handleClose() {
    this.setState({ file: null });
  }

  // ImageCrop returns a file blob.
  handleCrop(blob) {
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
    this.props.onImagePick(blob, url);
    this.handleClose();
  }

  render() {
    return (
      <div onClick={this.handleFileSelect} className={this.props.className} style={{ backgroundColor: '#f00', height: '200px' }}>
        {this.props.children}
        {this.state.file && (
          <Layer>
            <ImageCrop
              image={this.state.file}
              width={this.props.cropWidth}
              height={this.props.cropHeight}
              bleedWidth={this.props.bleedWidth}
              onClose={this.handleClose}
              onCrop={this.handleCrop}
            />
          </Layer>
        )}
      </div>
    );
  }
}
