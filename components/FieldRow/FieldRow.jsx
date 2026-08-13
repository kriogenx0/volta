import React from 'react';

import './FieldRow.scss';

const FieldRow = ({ label, children, centered }) => (
  <div className={`volta-field_row${centered ? ' field_row-centered' : ''}`}>
    <div className="field_row-label">{label}</div>
    <div className="field_row-body">{children}</div>
  </div>
);

export default FieldRow;
