import PropTypes from 'prop-types';

// `text` is the caption and `children` the control it labels. With both, the
// caption sits above the control; with only one, that one is rendered alone.
const Label = ({ text, children }) => {
  if (text && children) {
    return (
      <div className="volta-label">
        <label>
          <div>{text}</div>
          <div>{children}</div>
        </label>
      </div>
    );
  }

  return (
    <div className="volta-label">
      <label>
        {children || text}
      </label>
    </div>
  );
};

Label.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node
};

export default Label;
