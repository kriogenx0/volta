// Renders a modular, re-usable base form that abstracts boilerplate
// submit/error-handling logic.
//
// Usage:
//
// import BaseForm from './BaseForm';
//
// <BaseForm
//   action="/auth/login/"
//   fields={[{ fieldName: 'username', inputType: 'text', displayName: 'Username' }]}
//   submitValue="Log In"
//   handle200={(response) => ...}
// />
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import ErrorList from '../Message/ErrorList';
import BaseInput from './BaseInput';

const BaseForm = ({
  fields, submitValue, submittingValue, handle200, handle201, handle400, handle404,
  autoSelectFirst, showSubmit, shouldSubmit, onSubmit, action, centered, submitButtonClass, children
}) => {
  const formRef = useRef(null);
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setIsSubmitting(true);
    onSubmit();

    try {
      const response = await fetch(action, {
        method: 'POST',
        body: new FormData(formRef.current),
        credentials: 'include'
      });

      setIsSubmitting(false);

      if (response.status === 200) {
        setFormErrors([]);
        if (handle200) handle200(response);
      } else if (response.status === 201) {
        setFormErrors([]);
        if (handle201) handle201(response);
      } else if (response.status === 400) {
        const body = await response.json();
        setFormErrors(body);
        if (handle400) handle400(response, body);
      } else if (response.status === 404) {
        setFormErrors({ 'SERVER ERROR': '404 - Page not found.' });
        if (handle404) handle404(response);
      }
    } catch (error) {
      setIsSubmitting(false);
      setFormErrors({ 'SERVER ERROR': error.message });
    }
  };

  useEffect(() => {
    if (shouldSubmit && !isSubmitting) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldSubmit]);

  return (
    <form method="POST" ref={formRef} action={action} onSubmit={handleSubmit} className="volta-base_form">
      <ErrorList errors={formErrors} />

      <div className="form">
        {fields.map((field, i) => (
          <BaseInput
            displayName={field.displayName}
            inputType={field.inputType}
            fieldName={field.fieldName}
            key={field.fieldName}
            autoSelect={i === 0 && autoSelectFirst}
            centered={centered || false}
          />
        ))}
        {children}
        <div style={{ display: showSubmit ? 'block' : 'none' }}>
          {isSubmitting
            ? <button className={`btn btn-primary ${submitButtonClass} l-full-width is-disabled`}>{submittingValue}</button>
            : <input type="submit" value={submitValue} className={`btn btn-primary l-full-width ${submitButtonClass}`} />}
        </div>
      </div>
    </form>
  );
};

BaseForm.propTypes = {
  action: PropTypes.string,
  fields: PropTypes.array,
  submitValue: PropTypes.string,
  submittingValue: PropTypes.string,
  handle200: PropTypes.func,
  handle201: PropTypes.func,
  handle400: PropTypes.func,
  handle404: PropTypes.func,
  autoSelectFirst: PropTypes.bool,
  showSubmit: PropTypes.bool,
  shouldSubmit: PropTypes.bool,
  onSubmit: PropTypes.func,
  centered: PropTypes.bool,
  submitButtonClass: PropTypes.string
};

BaseForm.defaultProps = {
  fields: [],
  submitValue: 'Submit',
  submittingValue: 'Submitting...',
  handle200: null,
  handle201: null,
  handle400: null,
  handle404: null,
  autoSelectFirst: false,
  showSubmit: true,
  shouldSubmit: false,
  onSubmit: () => {}
};

export default BaseForm;
