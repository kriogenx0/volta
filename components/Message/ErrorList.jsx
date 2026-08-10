// Renders a re-usable error list for field validation, formatted for
// errors keyed by field name (e.g. a Django REST Framework error response).
import PropTypes from 'prop-types';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const ErrorList = ({ errors }) => (
  <ul className="errorList l-v-spaced">
    {Object.keys(errors).map((key) => (
      <li key={key}>
        <span
          style={{ width: 10, height: 10, background: '#ea5f5f', display: 'inline-block', borderRadius: '50%' }}
          className="l-h-right-half-spaced l-v-align-middle"
        />
        {key !== 'non_field_errors' && (
          <strong className="strong l-v-align-middle">{capitalize(key)}: </strong>
        )}
        <span className="l-v-align-middle">{errors[key]}</span>
      </li>
    ))}
  </ul>
);

ErrorList.propTypes = {
  errors: PropTypes.object
};

ErrorList.defaultProps = {
  errors: {}
};

export default ErrorList;
