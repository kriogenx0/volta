// Renders a re-usable error list for field validation, formatted for
// errors keyed by field name (e.g. a Django REST Framework error response).
import PropTypes from 'prop-types';

import './ErrorList.scss';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// DRF sends several messages for one field as an array of strings
const messageFor = (value) => (Array.isArray(value) && value.every((item) => typeof item === 'string') ? value.join(' ') : value);

const ErrorList = ({ errors }) => (
  <ul className="volta-error_list errorList l-v-spaced">
    {Object.keys(errors || {}).map((key) => (
      <li key={key}>
        <span className="volta-error_list-dot l-h-right-half-spaced l-v-align-middle" aria-hidden="true" />
        {key !== 'non_field_errors' && (
          <strong className="strong l-v-align-middle">{capitalize(key)}: </strong>
        )}
        <span className="l-v-align-middle">{messageFor(errors[key])}</span>
      </li>
    ))}
  </ul>
);

ErrorList.propTypes = {
  // Messages keyed by field name; `non_field_errors` is shown without a field label
  errors: PropTypes.object
};

export default ErrorList;
