import React from 'react';
import PropTypes from 'prop-types';

import './TextEditable.scss';

export default class TextEditable extends React.Component {
  static propTypes = {
    onFinish: PropTypes.func,
  };

  // el = typeof this.props.innerRef === 'function' ? { current: null } : React.createRef<HTMLElement>();

  // getEl = () => (this.props.innerRef && typeof this.props.innerRef !== 'function' ? this.props.innerRef : this.el).current;
  getEl = () => this.el;

  value = () => {
    const el = this.getEl();
    if (!el) return null;
    return el.innerHTML;
  };

  componentDidMount() {
    this.initialValue = this.value();
  }

  // handleKeyChange = e => {
  // console.log('e', e.target.innerHTML);
  // this.props.onKeyChange && this.props.onKeyChange(e.target.innerHTML);
  // };

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const el = this.getEl();
      if (el) el.blur();
    } else if (e.key === 'Escape') {
      const el = this.getEl();
      if (el) {
        el.innerHTML = this.initialValue;
        el.blur();
      }
    }
  };

  handleChange = (e) => {
    const html = this.value();
    if (html === null) return;

    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      // const newEvent = Object.assign({}, e, {
      //   target: {
      //     value: html
      //   }
      // });
      // this.props.onChange(newEvent);
      this.props.onChange(html);
    }
    this.lastHtml = html;
  };

  handleBlur = (e) => {
    const value = this.value();
    this.initialValue = value;
    this.props.onBlur && this.props.onBlur(value);
    this.handleChange(e);
    this.handleFinish(value);
  };

  handleFinish = (value) => {
    this.props.onFinish && this.props.onFinish(value);
  };

  render() {
    const {
      tagName, children, onFinish, ...props
    } = this.props;

    const value = this.value() || this.props.value || this.props.children;

    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref: (el) => { this.el = el; },
        className: `volta-text_editable ${this.props.className || ''}`,
        // onKeyUp: this.handleKeyChange,
        onKeyDown: this.handleKeyDown,
        onInput: this.handleChange,
        onBlur: this.handleBlur,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: { __html: value },
      },
    );
  }
}
