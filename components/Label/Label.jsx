import PropTypes from 'prop-types';

const Label = ({ text, children }) => {
  if (text && children) {
    return (
      <div className="c-label">
        <label>
          <div>{text}</div>
          <div>{children}</div>
        </label>
      </div>
    );
  }

  return (
    <div className="c-label">
      <label>
        {children}
      </label>
    </div>
  );
};

Label.propTypes = {
  text: PropTypes.string
};

export default Label;
