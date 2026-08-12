import { useState, useEffect } from 'react';
import _ from 'lodash';

import TextBox from '../TextBox';
import PopOver from '../PopOver/PopOver';

import './SearchSelector.scss';

const SearchSelector = ({ open: openProp, onType }) => {
  const [open, setOpen] = useState(openProp);
  const [query, setQuery] = useState(undefined);
  const [resultItems, setResultItems] = useState(undefined);
  const [tags, setTags] = useState(undefined);
  const [inside] = useState(undefined);

  useEffect(() => {
    setOpen(openProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openProp]);

  const handleOnType = (e) => {
    if (!e.target) return;
    let items;
    let val = e.target.value;
    if (onType) items = onType(val);

    setQuery(val);
    setResultItems(items);
  };

  const handleResultItemClick = (val) => {
    let newTags = tags;
    if (newTags instanceof Array) {
      if (newTags.indexOf(val) == -1)
        newTags.push(val);
    } else {
      newTags = [val];
    }

    setTags(newTags);
  };

  const renderResultItems = () => {
    if (inside) {
      return inside;
    } else if (resultItems) {
      return _.map(resultItems, (item, index) => {
        return (
          <div className='result_item no_select' key={index} onClick={(() => { return handleResultItemClick(item); })}>{item}</div>
        );
      });
    }
  };

  return (
    <div className='volta-search_selector'>
      <PopOver open={open}>
        <div className='search_selector-query'>
          <TextBox value={query} onChange={handleOnType} />
        </div>
        <div className='search_selector-tags'>
          {_.map(tags, (tag, index) => {
            return (
              <div className='tag' key={index}>{tag}</div>
            );
          })}
        </div>
        <div className='search_selector-content'>
          {renderResultItems()}
        </div>
      </PopOver>
    </div>
  );
};

SearchSelector.defaultProps = {
  open: false,
  multipleItems: true,
  uniqueItems: true
}

export default SearchSelector;
