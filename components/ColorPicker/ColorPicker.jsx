import React from 'react';
import PropTypes from 'prop-types';
import tinycolor from 'tinycolor2';

import Square from './color-picker-square';
import Slider from './color-picker-slider';
import Palette from './color-picker-palette';

export default class ColorPicker extends React.Component {

  static propTypes = {
    name: PropTypes.string,
    initialValue: PropTypes.string,
    palette: PropTypes.array,
    onValueChange: PropTypes.func,
    updateColor: PropTypes.func
  };

  static defaultProps = {
    name: 'color',
    initialValue: '#FFFFFF',
    palette: [
      '#F06060', '#60AAF0', '#60F06E', '#F0D860',
      '#60D8F0', '#CCCCCC', '#F0B460', '#9060F0',
      '#4A90E2', '#50E3C2', '#9B9B9B', '#000000'
    ],
    onValueChange: () => {}
  };

  constructor(props) {
    super(props);
    this.hexInput = React.createRef();
    this.panelHexInput = React.createRef();

    this.showPanel = this.showPanel.bind(this);
    this.hidePanel = this.hidePanel.bind(this);
    this.handleHexChange = this.handleHexChange.bind(this);
    this.handleHueChange = this.handleHueChange.bind(this);
    this.handleSaturationChange = this.handleSaturationChange.bind(this);
    this.handleLightnessChange = this.handleLightnessChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.preventPanelEventBubble = this.preventPanelEventBubble.bind(this);
    this.handleSwatchSelect = this.handleSwatchSelect.bind(this);
  }

  // getInitialState() {
  //   hex: null
  //   hue: null
  //   saturation: null
  //   lightness: null
  //   visible: false


  componentWillMount() {
    let initialColor = tinycolor(this.props.initialValue);
    let hsl = initialColor.toHsl();

    this.setState({
      hex: this.props.initialValue,
      hue: hsl.h,
      saturation: hsl.s * 100,
      lightness: hsl.l * 100
    });
  }


  componentWillUnmount() {
    document.removeEventListener("click", this.hidePanel);
    // this.hidePanel();
  }


  setValue(hex) {
    this.setState({ hex: hex });
    this.props.onValueChange(hex);
  }


  setHex(hex) {
    this.setValue(hex.toUpperCase());

    if (this.props.updateColor)
      this.props.updateColor(hex.toUpperCase());

    const hsl = tinycolor(hex).toHsl();
    this.setState({
      hue: hsl.h,
      saturation: hsl.s * 100,
      lightness: hsl.l * 100
    });
  }

  setHue(hue) {
    this.setState({ hue: hue });
    this.setValue(tinycolor({
      h: hue,
      s: this.state.saturation,
      l: this.state.lightness
    }).toHexString().toUpperCase());
  }


  setSaturation(saturation) {
    this.setState({ saturation: saturation });
    this.setValue(tinycolor({
      h: this.state.hue,
      s: saturation,
      l: this.state.lightness
    }).toHexString().toUpperCase());
  }


  setLightness(lightness) {
    this.setState({ lightness: lightness });
    this.setValue(tinycolor({
      h: this.state.hue,
      s: this.state.saturation,
      l: lightness
    }).toHexString().toUpperCase());
  }


  handleHexChange(e) {
    this.setHex(e.target.value);
  }


  handleHueChange(event) {
    this.setHue(this.numericOrNull(event.target.value));
  }


  handleSaturationChange(event) {
    this.setSaturation(this.numericOrNull(event.target.value));
  }


  handleLightnessChange(event) {
    this.setLightness(this.numericOrNull(event.target.value));
  }


  handleKeyPress(event) {
    if (event.which == 13) this.hidePanel();
  }


  // # Convenience method to coerce a value to be a number or null instead of NaN
  numericOrNull(value) {
    value = parseFloat(value);
    if (Number.isNaN(value)) value = null;
    return value;
  }


  showPanel(event) {

    // # Left click only
    if (event.button !== 0) return;

    this.setState({ visible: true });
    document.addEventListener("click", this.hidePanel);

    // # Pretty sure this is not the best way to wait for panel node to render
    this.hexInput.current.blur();
    const input = this.panelHexInput.current;
    input.setSelectionRange(1, 7);
    setTimeout(() => {
      input.focus();
    }, 400);

    // # Prevent focus on input under panel
    event.preventDefault();
  }

  hidePanel() {
    this.setHex(tinycolor(this.state.hex).toHexString());
    this.setState({ visible: false });
    document.removeEventListener("click", this.hidePanel);
  }


  preventPanelEventBubble(event) {
    event.nativeEvent.stopImmediatePropagation();
  }


  handleSwatchSelect(hex) {
    this.setState({ hex: hex }, this.hidePanel);
  }


  render() {
    const blotStyle = { backgroundColor: this.state.hex };

    const inputProps = {
      type: "text",
      className: "txt",
      onKeyPress: this.handleKeyPress
    };

    return (
      <div className="cpr">
        <div className="cpr_blot" style={blotStyle} onClick={this.showPanel}></div>
        <input className="txt cpr_input" ref={this.hexInput} value={this.state.hex} onChange={this.handleHexChange} onClick={this.showPanel} name={this.props.name} />
        <div className={`cpr_panel ddn ${this.state.visible ? 'is-visible' : ''}`} onClick={this.preventPanelEventBubble}>
          <section>
            <Square
              onSaturationChange={this.setSaturation}
              onLightnessChange={this.setLightness}
              hue={this.state.hue}
              saturation={this.state.saturation}
              lightness={this.state.lightness}
            />
            <Slider
              onHueChange={this.setHue}
              hue={this.state.hue}
            />
          </section>
          <aside>
            <div className="cpr_blot is-small" style={blotStyle}></div>
            <input className="txt cpr_input" ref={this.panelHexInput} value={this.state.hex} onChange={this.handleHexChange} onKeyPress={this.handleKeyPress} />
            <ul className="cpr_hsb">
              <li>
                <input value={this.state.hue} onChange={this.handleHueChange} {...inputProps} />
                <span>H</span>
              </li>
              <li>
                <input value={this.state.saturation} onChange={this.handleSaturationChange} {...inputProps} />
                <span>S</span>
              </li>
              <li>
                <input value={this.state.lightness} onChange={this.handleLightnessChange} {...inputProps} />
                <span>L</span>
              </li>
            </ul>
            <div className="cpr_split"></div>
            <Palette colors={this.props.palette} onColorSelect={this.handleSwatchSelect} />
          </aside>
        </div>
      </div>
    );
  }
}

