import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactRTE from 'react-rte';

import './RichTextReactRTE.scss';

const RichTextReactRTE = ({ value: valueProp, onChange }) => {
  const [value, setValue] = useState(valueProp || ReactRTE.createEmptyValue());

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      onChange(newValue.toString('html'));
    }
  };

  return (
    <ReactRTE
      toolbarConfig={RichTextReactRTE.toolbarConfig}
      value={value}
      onChange={handleChange}
    />
  );
};

RichTextReactRTE.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

RichTextReactRTE.toolbarConfig = {
  // Optionally specify the groups to display (displayed in the order listed).
  display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
  INLINE_STYLE_BUTTONS: [
    { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' }
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: 'Normal', style: 'unstyled' },
    { label: 'Heading Large', style: 'header-one' },
    { label: 'Heading Medium', style: 'header-two' },
    { label: 'Heading Small', style: 'header-three' }
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' }
  ]
};

export default RichTextReactRTE;
