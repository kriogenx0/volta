import PropTypes from 'prop-types';

import './Field.scss';

const Field = ({ className, type, stack, label, children }) => {
  // ironyoung-compat: c-field is the class name its own view-level scss targets directly.
  let fieldClassName = 'volta-field c-field' + (className ? ' ' + className : '');
  if (type) fieldClassName += ' field-' + type;
  if (stack) fieldClassName += ' field-stack';

  if (label) {
    return (
      <div className={fieldClassName}>
        <div className='field-label'>
          {label}
        </div>
        <div className='field-child'>
          {children}
        </div>
        <div className='field-clear' />
      </div>
    );
  }

  return (
    <div className={fieldClassName}>
      {children}
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string,
  // stack: true, false, auto
  stack: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
};

export default Field;
