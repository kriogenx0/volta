import React, { useState } from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';

import TextField from '../TextField';

import './TagInput.scss';

const TagInput = ({ tags, value, onChange, ...props }) => {

  const [tagState, setTags] = useState(tags || []);
  const [inputText, setInputText] = useState(value || '');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (!_.includes(TagInput.submitKeys, e.key)) return;
    e.preventDefault();
    const tag = e.target.value;
    if (!tag.length) return;

    const newTags = [...(tagState || [])];
    if (!_.includes(newTags, tag)) newTags.push(tag);

    setInputText('');
    updateTags(newTags);
  }

  const handleRemoveTag = tag => {
    const newTags = _.without(tagState, tag);
    updateTags(newTags);
  };

  const updateTags = tags => {
    setTags(tags);
    onChange && onChange(tags);
  };

  return (
    <div className='volta-tag_input'>
      <TextField name='tags' value={inputText} onChange={handleInputChange} onKeyPress={handleInputKeyPress} {...props} />
      <div className="tag_input-tags">
        {_.map(tagState, tag => (
          <span className='tag deletable' key={tag}>
            <span>{tag}</span>
            <button
              type="button"
              className="tag_input-remove"
              aria-label={`Remove ${tag}`}
              onClick={() => handleRemoveTag(tag)}
            >
              <span aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

TagInput.submitKeys = ['Enter', ',', ' ', 'Space'];

TagInput.propTypes = {
  tags: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func
};

export default TagInput;
