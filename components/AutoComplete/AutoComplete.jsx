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
import { useState, useRef, useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import Fuzzy from 'fuzzy';

import AutoCompleteRow from './AutoCompleteRow';

import './_autocomplete.scss';

const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

// Shared defaults. `selected` must keep one identity between renders: a new []
// each time would look like a new selection and reset the component.
const NONE = [];
const noop = () => {};
const alwaysValid = () => true;
const defaultAddMessage = (value) => <span>Add &quot;<span className="strong">{value}</span>&quot; (press enter)</span>;

const AutoComplete = ({
  options = NONE, selected = NONE, onChange = noop, onAdd = noop, onFocus = noop, onFooterClick = noop,
  footerTitle = null, compact = false, placeholder = null, name = null, detect = null, allowAdd = false, limit = Infinity,
  className = '', isValidResult = alwaysValid, formatAddMessage = defaultAddMessage, 'aria-label': ariaLabel
}) => {
  const [chosen, setChosen] = useState(selected);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [focusedRow, setFocusedRow] = useState(-1);
  const [focusedPill, setFocusedPill] = useState(-1);

  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  // What the list shows: the options not yet chosen that match the text, A-Z.
  // Worked out on every render so new options or text can't leave it stale.
  const chosenValues = chosen.map((item) => item.value);
  const matching = options.filter((option) => isValidResult(option) && !chosenValues.includes(option.value));
  const filteredOptions = Fuzzy.filter(value, matching, { extract: (el) => el.title })
    .map((res) => res.original)
    .sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0));

  // Take a new selection from the parent
  useEffect(() => {
    setChosen(selected);
  }, [selected]);

  // A click outside closes the list. Blur does that for the keyboard, but a
  // single-choice box with a choice has a disabled text box, which never blurs.
  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  const handleChange = (newChosen) => {
    setChosen(newChosen);
    onChange(newChosen);
  };

  const clearValue = () => setValue('');

  // Returns whether the option was added
  const handleSelect = (option, e) => {
    if (e) e.preventDefault();
    if (e && (e.which === 3 || e.button === 2)) return false; // ignore right click
    if (!option) return false;

    // Already chosen (e.g. the same address typed twice): just clear the text
    if (chosen.some((item) => item.value === option.value)) {
      setValue('');
      return false;
    }

    let willClose = e && e.button === 0;
    if (limit === 1) willClose = true;

    let newChosen = chosen;
    if (limit === 1 && chosen.length) newChosen = [];
    newChosen = newChosen.concat(option);

    setValue('');
    handleChange(newChosen);
    if (willClose) {
      setOpen(false);
      if (inputRef.current) inputRef.current.blur();
    }
    return true;
  };

  const handleAdd = () => {
    if (handleSelect({ title: value, value })) onAdd(value);
  };

  const detectEmail = () => {
    const email = value.replace(/\s+/g, '');
    if (email.match(emailPattern)) {
      handleSelect({ title: email, value: email });
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
    handleChange(chosen.filter((o) => o.value !== item.value));
  };

  const handleRemoveAll = (e) => {
    e.preventDefault();
    setOpen(false);
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
    if (e.keyCode === 27) { setOpen(false); return; } // escape
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
    setFocusedRow(-1);
  };

  const handleFocus = () => {
    onFocus();
    setOpen(true);
  };

  const handleBlur = () => {
    setOpen(false);
    setFocusedRow(-1);
    setFocusedPill(-1);
    setTimeout(clearValue, 200);
  };

  const handleTagContainerClick = () => {
    if (!open) clearValue();
    if (limit === 1 && filteredOptions.length) setOpen((prev) => !prev);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleFooterClick = (e) => {
    e.preventDefault();
    onFooterClick();
    setOpen(false);
  };

  const showList = open && (filteredOptions.length > 0 || value !== '');
  const optionId = (index) => `${listId}-option-${index}`;

  const classes = ['volta-auto_complete twd twd-short autocomplete l-full-width', className];
  if (showList) classes.push('is-open');
  if (limit === 1) classes.push('is-single');

  return (
    <div className={classes.join(' ')} ref={rootRef}>
      <input
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && focusedRow >= 0 && focusedRow < filteredOptions.length ? optionId(focusedRow) : undefined}
        aria-label={ariaLabel || placeholder || undefined}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={value}
        className="txt l-full-width twd_input"
        placeholder={chosen.length >= limit ? '' : placeholder || ''}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        onChange={handleValueChange}
        disabled={chosen.length >= limit}
        ref={inputRef}
      />

      {/* Mousedown inside the list must not blur the text box, or the list would close before a click lands */}
      <div className="twd_dropdown ddn" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.preventDefault()}>
        <div className="twd_dropdown_scroll">
          <ul id={listId} role="listbox" className={`autocomplete_options lst ${compact ? 'lst-compact' : ''}`}>
            {filteredOptions.length === 0 && !allowAdd && value !== '' && (
              <li role="presentation" className="lst_row l-half-padded deemphasized">No matching results.</li>
            )}

            {filteredOptions.map((option, index) => (
              <AutoCompleteRow
                key={option.value}
                id={optionId(index)}
                data={option}
                isFocused={focusedRow === index}
                onClick={(e) => handleSelect(option, e)}
              />
            ))}

            {chosen.length > 0 && limit === 1 && (
              <li role="presentation" className="lst_row lst_row-divider-above is-deletable">
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
              <a href="#" className="twd_footer_link" onClick={handleFooterClick}>{footerTitle}</a>
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
                <button type="button" aria-label={`Remove ${item.title}`} onClick={() => handleRemove(item)}>&times;</button>
              )}
            </span>
          </div>
        ))}
      </div>
      <input type="hidden" name={name || undefined} value={chosen.map((item) => item.value).join(',')} />
    </div>
  );
};

AutoComplete.propTypes = {
  onFooterClick: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onAdd: PropTypes.func,
  // Each option is { title, value }; values must be unique
  options: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.any
  })),
  selected: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.any
  })),
  footerTitle: PropTypes.string,
  compact: PropTypes.bool,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  detect: PropTypes.oneOf(['email']),
  allowAdd: PropTypes.bool,
  limit: PropTypes.number,
  className: PropTypes.string,
  isValidResult: PropTypes.func,
  formatAddMessage: PropTypes.func,
  // Names the text box for assistive tech; falls back to the placeholder
  'aria-label': PropTypes.string
};

export default AutoComplete;
