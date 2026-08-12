import React from 'react';

import './FormField.scss';

const FormField = ({ label, children, centered }) => (
  <div className={'volta-form_field' + (centered ? ' form_field-centered' : '')}>
    <div className='form_field-label'>{label}</div>
    <div className='form_field-body'>{children}</div>
  </div>
);

export default FormField;
