import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { TextBox } from '../TextBox/TextBox';
import Modal from '../Modal/Modal';

import './SearchSelector.scss';
import { map } from '../../util/collection';

// A popover with a search box. `onType(query)` returns the matching items;
// clicking one adds it to the selected tags, reported through `onChange`.
const SearchSelector = ({ open: openProp = false, onType, onChange, onClose, multipleItems = true, uniqueItems = true }) => {
  const [open, setOpen] = useState(openProp);
  const [query, setQuery] = useState('');
  const [resultItems, setResultItems] = useState(undefined);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  const handleOnType = (e) => {
    if (!e.target) return;
    const val = e.target.value;

    setQuery(val);
    setResultItems(onType ? onType(val) : undefined);
  };

  const handleResultItemClick = (item) => {
    if (multipleItems && uniqueItems && tags.includes(item)) return;

    // A new array each time: React ignores a state update to the same array
    const newTags = multipleItems ? [...tags, item] : [item];
    setTags(newTags);
    if (onChange) onChange(newTags);
  };

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  return (
    <div className='volta-search_selector'>
      <Modal open={open} handleClose={handleClose} aria-label="Search">
        <div className='search_selector-query'>
          <TextBox value={query} onChange={handleOnType} aria-label="Search" />
        </div>
        <div className='search_selector-tags'>
          {map(tags, (tag, index) => (
            <div className='tag' key={index}>{tag}</div>
          ))}
        </div>
        <div className='search_selector-content'>
          {map(resultItems, (item, index) => (
            <button type='button' className='result_item no_select' key={index} onClick={() => handleResultItemClick(item)}>{item}</button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

SearchSelector.propTypes = {
  open: PropTypes.bool,
  // (query) => array of items to show
  onType: PropTypes.func,
  // (tags) => called with the selected items whenever they change
  onChange: PropTypes.func,
  // Called when the popover is dismissed
  onClose: PropTypes.func,
  multipleItems: PropTypes.bool,
  uniqueItems: PropTypes.bool
};

export default SearchSelector;
