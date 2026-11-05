import PropTypes from 'prop-types';

import Icon from "../Icon";

import "./Tag.scss";

const Tag = ({ children, deletable, onClick }) => {

  let className = 'volta-tag';
  if (deletable) className += ' deletable';
  if (onClick) className += ' clickable';

  // A clickable tag is a button as far as the keyboard and assistive tech are concerned.
  const handleKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };
  const interactiveProps = onClick ? { role: 'button', tabIndex: 0, onKeyDown: handleKeyDown } : {};

  return (
    <span className={className} onClick={onClick} {...interactiveProps}>
      {children} {deletable && <Icon type='xmark' aria-hidden="true" /> }
    </span>
  );
};

Tag.propTypes = {
  children: PropTypes.node,
  deletable: PropTypes.bool,
  onClick: PropTypes.func
};

export default Tag;
