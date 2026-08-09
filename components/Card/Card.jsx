import PropTypes from 'prop-types';

import './Card.scss';

const Card = ({ selected, selectable, children, className, onClick }) => {
  let cardClassName = 'control-card';
  if (className) cardClassName += ' ' + className;
  if (selectable) cardClassName += ' control-card-selectable';
  if (selected) cardClassName += ' control-card-selected';

  return (
    <div className={cardClassName} onClick={onClick}>
      {children}
    </div>
  );
};

Card.propTypes = {
  selected: PropTypes.bool,
  selectable: PropTypes.bool,
  onClick: PropTypes.func
};

export default Card;
