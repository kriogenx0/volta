// Scale Slider Component
// UI for changing the scale of an image to crop. Mimics input[type=range]

import React from 'react';
import PropTypes from 'prop-types';

export default class ScaleSlider extends React.Component {

  constructor(props) {
    super(props);
    this.state = { moving: false };
    this.slide = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidUpdate(props, state) {
    const moveStarted = this.state.moving && !state.moving;
    const moveStopped = !this.state.moving && state.moving;

    if (moveStarted) {
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    } else if (moveStopped) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  }

  handleMouseDown(event) {
    if (event.button !== 0) return;

    this.setState({ moving: true });
    this.handleMove(event);
    event.stopPropagation();
    event.preventDefault();
  }

  handleMouseMove(event) {
    if (!this.state.moving) return;

    this.handleMove(event);
    event.stopPropagation();
    event.preventDefault();
  }

  handleMove(event) {
    const slideNode = this.slide.current;
    const slideOffset = slideNode.getBoundingClientRect().left + window.scrollX;
    const slideWidth = slideNode.offsetWidth;

    let percent = (event.pageX - slideOffset) / slideWidth;
    percent = Math.min(percent, 1);
    percent = Math.max(percent, 0);

    this.props.onChange(percent * this.props.max);
  }

  handleMouseUp(event) {
    this.setState({ moving: false });
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    const markerStyle = { left: `${(this.props.value / this.props.max) * 100}%` };

    return (
      <div className="icr_slide_wrap">
        <div className="icr_slide" ref={this.slide} onMouseDown={this.handleMouseDown}>
          <div className="icr_tick is-left"></div>
          <div className="icr_tick is-mid"></div>
          <div className="icr_tick is-right"></div>
          <div className="icr_slide_marker" style={markerStyle}></div>
        </div>
      </div>
    );
  }
}

ScaleSlider.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func
};

ScaleSlider.defaultProps = {
  value: 1,
  max: 2,
  min: 0,
  onChange: () => {}
};
