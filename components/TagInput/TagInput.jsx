import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import TextBox from '../TextBox';

import './TagInput.scss';

const TagInput = ({ tags, value, onChange, removable = false, ...props }) => {

  const [tagState, setTags] = useState(tags || []);
  const [inputText, setInputText] = useState(value || '');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (!TagInput.submitKeys.includes(e.key)) return;
    e.preventDefault();
    const tag = e.target.value;
    if (!tag.length) return;

    const newTags = [...(tagState || [])];
    if (!newTags.includes(tag)) newTags.push(tag);

    setInputText('');
    updateTags(newTags);
  }

  const handleRemoveTag = tag => {
    const newTags = tagState.filter((existing) => existing !== tag);
    updateTags(newTags);
  };

  const updateTags = tags => {
    setTags(tags);
    onChange && onChange(tags);
  };

  return (
    <div className='volta-tag_input'>
      <TextBox name='tags' value={inputText} onChange={handleInputChange} onKeyPress={handleInputKeyPress} {...props} />
      <div className="tag_input-tags">
        {tagState.map(tag => (
          <span className={`tag${removable ? ' deletable' : ''}`} key={tag}>
            <span>{tag}</span>
            {removable && (
              <button
                type="button"
                className="tag_input-remove"
                aria-label={`Remove ${tag}`}
                onClick={() => handleRemoveTag(tag)}
              >
                <Icon type="xmark" aria-hidden="true" />
              </button>
            )}
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
  onChange: PropTypes.func,
  // Show an x on each tag to remove it
  removable: PropTypes.bool
};

export default TagInput;
