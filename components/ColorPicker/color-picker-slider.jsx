// Color Picker Hue Slider
// Slide handle to change HUE (0-360)
// Expects an initial hex value and a callback for hue changes

import React from 'react';
import PropTypes from 'prop-types';

export default class ColorPickerSlider extends React.Component {

  static propTypes = {
    hue: PropTypes.number,
    onHueChange: PropTypes.func
  };

  static defaultProps = {
    hue: 180,
    onHueChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = { moving: false, hue: null };
    this.slider = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentWillMount() {
    this.setState({ hue: this.props.hue });
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

    if (this.props.hue !== this.state.hue) {
      this.setState({ hue: this.props.hue });
    }
  }

  handleMouseDown(event) {
    if (event.button !== 0) return; // Left click only

    this.setState({ moving: true });
    this.setHueFromEvent(event);
  }

  handleMouseMove(event) {
    if (!this.state.moving) return;
    this.setHueFromEvent(event);
  }

  handleMouseUp() {
    this.setState({ moving: false });
  }

  setHueFromEvent(event) {
    const sliderNode = this.slider.current;
    const sliderOffset = { left: sliderNode.getBoundingClientRect().left + window.scrollX };

    let pos = event.pageX - sliderOffset.left;
    pos = Math.max(pos, 0);
    pos = Math.min(pos, sliderNode.offsetWidth);

    const hue = parseInt((pos / sliderNode.offsetWidth) * 360, 10);

    this.props.onHueChange(hue);
    this.setState({ hue });
  }

  render() {
    const sliderStyle = { left: `${(this.state.hue / 360) * 100}%` };

    return (
      <div className="cpr_rainbow" ref={this.slider} onMouseDown={this.handleMouseDown}>
        <div className="cpr_slide" style={sliderStyle}></div>
      </div>
    );
  }

}
