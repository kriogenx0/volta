// Renders an autocomplete input over a plain array of options.
//
// <AutoComplete
//   options={[{ title: 'One', value: 1 }, { title: 'Two', value: 2 }]}
//   selected={selected}
//   onChange={setSelected}
// />
//
// NOTE: the original version of this component also supported a `store`
// prop (a Backbone-style collection store) and richer row rendering via
// Pill/Avatar/Track child components, none of which exist in this repo.
// That mode was dropped rather than ported with fabricated stand-ins --
// this is the plain-array mode only.
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Fuzzy from 'fuzzy';

import AutoCompleteRow from './AutoCompleteRow';

import './_autocomplete.scss';

const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const AutoComplete = ({
  options, selected, onChange, onAdd, onFocus, onFooterClick,
  footerTitle, compact, placeholder, name, detect, allowAdd, limit,
  className, isValidResult, formatAddMessage
}) => {
  const [chosen, setChosen] = useState(selected);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focusedRow, setFocusedRow] = useState(-1);
  const [focusedPill, setFocusedPill] = useState(-1);

  const inputRef = useRef(null);

  const filterOptions = (currentValue = value, currentChosen = chosen) => {
    const chosenValues = _.map(currentChosen, 'value');
    const list = options.filter((option) => isValidResult(option) && !chosenValues.includes(option.value));
    const results = Fuzzy.filter(currentValue, list, { extract: (el) => el.title }).map((res) => res.original);
    return results.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));
  };

  const [filteredOptions, setFilteredOptions] = useState(() => filterOptions('', selected));

  useEffect(() => {
    setChosen(selected);
    setFilteredOptions(filterOptions(value, selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleChange = (newChosen) => {
    setFilteredOptions(filterOptions(value, newChosen));
    onChange(newChosen);
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const clearValue = () => setValue('');

  const handleSelect = (option, e) => {
    if (e) e.preventDefault();
    if (e && (e.which === 3 || e.button === 2)) return; // ignore right click
    if (!option) return;

    let willClose = e && e.button === 0;
    if (limit === 1) willClose = true;

    let newChosen = chosen;
    if (limit === 1 && chosen.length) newChosen = [];
    newChosen = newChosen.concat(option);

    setChosen(newChosen);
    setValue('');
    handleChange(newChosen);
    if (willClose) {
      setOpen(false);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  const handleAdd = () => {
    handleSelect({ title: value, value });
    onAdd(value);
    setValue('');
    setFilteredOptions(filterOptions('', chosen));
  };

  const detectEmail = () => {
    if (value.replace(/\s+/g, '').match(emailPattern)) {
      handleSelect({ title: value, value });
    }
  };

  const detectSpecial = () => {
    if (detect) {
      const detectors = detect.split('|');
      if (detectors.includes('email')) {
        detectEmail();
        return;
      }
    }
    if (allowAdd && value !== '') handleAdd();
  };

  const handleClickAdd = (e) => {
    if (e) e.preventDefault();
    if (detect) detectSpecial();
    else handleAdd();
  };

  const handleRemove = (item) => {
    const newChosen = chosen.filter((o) => o.value !== item.value);
    setChosen(newChosen);
    handleChange(newChosen);
  };

  const handleRemoveAll = (e) => {
    e.preventDefault();
    setOpen(false);
    setChosen([]);
    handleChange([]);
  };

  const incrementFocusedRow = () => {
    setFocusedRow((row) => (row >= filteredOptions.length - 1 ? filteredOptions.length - 1 : row + 1));
  };

  const decrementFocusedRow = () => {
    setFocusedRow((row) => (row <= 0 ? 0 : row - 1));
  };

  const handleDelete = () => {
    if (value !== '') return;
    if (focusedPill >= 0) {
      handleRemove(chosen[focusedPill]);
      setFocusedPill(-1);
    } else {
      setFocusedPill(chosen.length - 1);
    }
  };

  const handleEnter = () => {
    if (focusedRow >= 0) handleSelect(filteredOptions[focusedRow]);
    else detectSpecial();
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 40) { incrementFocusedRow(); return; } // down
    if (e.keyCode === 38) { decrementFocusedRow(); return; } // up
    if (e.keyCode === 8) { handleDelete(); return; } // backspace
    if (e.keyCode === 9) { handleToggle(); return; } // tab
    if (e.keyCode === 13) { e.preventDefault(); handleEnter(); return; } // enter
    setFocusedPill(-1);
  };

  const handleKeyUp = (e) => {
    if (e.keyCode === 40 || e.keyCode === 38) return;
    if (e.keyCode === 32 && detect) detectSpecial(); // spacebar
  };

  const handleValueChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setFilteredOptions(filterOptions(newValue, chosen));
  };

  const handleBlur = () => {
    setFocusedRow(-1);
    setFocusedPill(-1);
    setTimeout(clearValue, 200);
  };

  const handleTagContainerClick = () => {
    if (!open) clearValue();
    if (limit === 1 && filteredOptions.length) handleToggle();
    if (inputRef.current) inputRef.current.focus();
  };

  const handleFooterClick = (e) => {
    e.preventDefault();
    onFooterClick();
    setOpen(false);
  };

  const classes = ['volta-auto_complete twd twd-short autocomplete l-full-width', className];
  if (open && (filteredOptions.length > 0 || value !== '')) classes.push('is-open');
  if (limit === 1) classes.push('is-single');

  return (
    <div className={classes.join(' ')}>
      <input
        onBlur={handleBlur}
        onFocus={() => { onFocus(); handleToggle(); }}
        value={value}
        className="txt l-full-width twd_input"
        placeholder={chosen.length >= limit ? '' : placeholder}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        onChange={handleValueChange}
        disabled={chosen.length >= limit}
        ref={inputRef}
      />

      <div className="twd_dropdown ddn" onClick={(e) => e.stopPropagation()}>
        <div className="twd_dropdown_scroll">
          <ul className={`autocomplete_options lst ${compact ? 'lst-compact' : ''}`}>
            {filteredOptions.length === 0 && !allowAdd && value !== '' && (
              <li className="lst_row l-half-padded deemphasized">No matching results.</li>
            )}

            {filteredOptions.map((option, index) => (
              <AutoCompleteRow
                key={option.value}
                data={option}
                isFocused={focusedRow === index}
                onClick={(e) => handleSelect(option, e)}
              />
            ))}

            {chosen.length > 0 && limit === 1 && (
              <li className="lst_row lst_row-divider-above is-deletable">
                <a href="#" onClick={handleRemoveAll}>Clear selection</a>
              </li>
            )}
          </ul>
        </div>
        {allowAdd && value !== '' ? (
          <div className="twd_footer">
            <a href="#" onClick={handleClickAdd} className="twd_footer_link">{formatAddMessage(value)}</a>
          </div>
        ) : (
          footerTitle && (
            <div className="twd_footer">
              <a href="#" tabIndex="-1" className="twd_footer_link" onClick={handleFooterClick}>{footerTitle}</a>
            </div>
          )
        )}
      </div>
      <div className="autocomplete_chosen" onClick={handleTagContainerClick}>
        {chosen.map((item, i) => (
          <div className="autocomplete_chosen_item" key={item.value}>
            <span className={`${focusedPill === i ? 'is-focused' : ''} autocomplete_chosen_item_pill`}>
              {item.title}
              {limit !== 1 && (
                <a href="#" onClick={(e) => { e.preventDefault(); handleRemove(item); }}>&times;</a>
              )}
            </span>
          </div>
        ))}
      </div>
      <input type="hidden" name={name} />
    </div>
  );
};

AutoComplete.propTypes = {
  onFooterClick: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onAdd: PropTypes.func,
  options: PropTypes.array,
  selected: PropTypes.array,
  footerTitle: PropTypes.string,
  compact: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  detect: PropTypes.oneOf(['email']),
  allowAdd: PropTypes.bool,
  limit: PropTypes.number,
  className: PropTypes.string,
  isValidResult: PropTypes.func,
  formatAddMessage: PropTypes.func
};

AutoComplete.defaultProps = {
  onFooterClick: () => {},
  onChange: () => {},
  onFocus: () => {},
  onAdd: () => {},
  isValidResult: () => true,
  formatAddMessage: (value) => <span>Add &quot;<span className="strong">{value}</span>&quot; (press enter)</span>,
  options: [],
  selected: [],
  footerTitle: null,
  compact: false,
  placeholder: null,
  name: null,
  detect: null,
  allowAdd: false,
  limit: Infinity,
  className: ''
};

export default AutoComplete;
