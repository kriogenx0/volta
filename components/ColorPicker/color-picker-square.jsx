// Color Picker Saturation and Lightness Square
// Drag marker to return saturation and lightness
// Expects an initial hex value and callbacks for saturation and lightness changes
//
// Note, internally this component uses HSV, externally we use HSL

import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

export default class ColorPickerSquare extends React.Component {

  static propTypes = {
    hue: PropTypes.number,
    saturation: PropTypes.number,
    lightness: PropTypes.number,
    onSaturationChange: PropTypes.func,
    onLightnessChange: PropTypes.func
  };

  static defaultProps = {
    hue: 0,
    saturation: 100,
    lightness: 100,
    onSaturationChange: () => {},
    onLightnessChange: () => {}
  };

  constructor(props) {
    super(props);
    this.state = { moving: false, saturation: null, value: null };
    this.square = React.createRef();

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentWillMount() {
    const hsv = tinycolor({
      h: this.props.hue,
      s: this.props.saturation,
      l: this.props.lightness
    }).toHsv();

    this.setState({ saturation: hsv.s * 100, value: hsv.v * 100 });
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

    // Update internal saturation and value if external values change
    let saturation;
    let lightness;

    if (props.saturation !== this.props.saturation) saturation = this.props.saturation;
    if (props.lightness !== this.props.lightness) lightness = this.props.lightness;

    if (saturation || lightness) {
      const hsv = tinycolor({
        h: props.hue,
        s: saturation || props.saturation,
        l: lightness || props.lightness
      }).toHsv();

      if (hsv.s * 100 !== this.state.saturation) this.setState({ saturation: hsv.s * 100 });
      if (hsv.v * 100 !== this.state.value) this.setState({ value: hsv.v * 100 });
    }
  }

  handleMouseDown(event) {
    if (event.button !== 0) return; // Left click only

    this.setState({ moving: true });
    this.setPos(event);
  }

  handleMouseMove(event) {
    if (!this.state.moving) return;
    this.setPos(event);
  }

  handleMouseUp() {
    this.setState({ moving: false });
  }

  setPos(event) {
    const squareNode = this.square.current;
    const rect = squareNode.getBoundingClientRect();
    const squareOffset = { left: rect.left + window.scrollX, top: rect.top + window.scrollY };

    const rawPos = {
      x: event.pageX - squareOffset.left,
      y: event.pageY - squareOffset.top
    };

    const pos = {
      x: Math.min(Math.max(rawPos.x, 0), squareNode.offsetWidth),
      y: Math.min(Math.max(rawPos.y, 0), squareNode.offsetHeight)
    };

    const saturation = (pos.x / squareNode.offsetWidth) * 100;
    const value = ((squareNode.offsetHeight - pos.y) / squareNode.offsetHeight) * 100;

    this.setState({ saturation, value });

    const hsl = tinycolor({ h: this.props.hue, s: saturation, v: value }).toHsl();

    this.props.onSaturationChange(hsl.s * 100);
    this.props.onLightnessChange(hsl.l * 100);
  }

  render() {
    const color = tinycolor({ h: this.props.hue, s: 1, l: 0.5 });
    const squareStyle = { backgroundColor: color.toHexString() };
    const top = (this.state.value - 100) * -1;
    const markerStyle = { left: `${this.state.saturation}%`, top: `${top}%` };

    return (
      <div className="cpr_square" ref={this.square} onMouseDown={this.handleMouseDown} style={squareStyle}>
        <div className="cpr_marker" style={markerStyle}></div>
        <div className="cpr_square_val"></div>
        <div className="cpr_square_sat"></div>
      </div>
    );
  }

}
