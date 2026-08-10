import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ComboBox.scss';

const ComboBox = ({ value: controlledValue, defaultValue = '', options, items = [], onSelect = () => {}, onChange = () => {}, onCommit, placeholder, disabled, inputClassName = '', className = '' }) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const optionRefs = useRef(new Map());
  const value = controlledValue === undefined ? internalValue : controlledValue;
  const choices = options || items;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = value.trim().toLowerCase();
  const matches = trimmed === '' ? choices : choices.filter((option) => option.toLowerCase().includes(trimmed));
  const update = (next) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange(next);
  };
  const commit = (next) => {
    update(next);
    onSelect(next);
    if (onCommit) onCommit(next);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className={`c-combo_box relative ${open ? 'is_open' : ''} ${className}`.trim()}>
      <input type="text" value={value} disabled={disabled} placeholder={placeholder} onFocus={() => setOpen(true)} onChange={(event) => { update(event.target.value); setHighlightedIndex(-1); }} onBlur={(event) => { if (onCommit) onCommit(event.target.value); setOpen(false); }} onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          const delta = event.key === 'ArrowDown' ? 1 : -1;
          setOpen(true);
          setHighlightedIndex((current) => (current + delta + matches.length) % matches.length);
        }
        if (event.key === 'Enter' && highlightedIndex >= 0 && matches[highlightedIndex]) { event.preventDefault(); commit(matches[highlightedIndex]); }
      }} className={inputClassName} />
      {open && !disabled && matches.length > 0 && <div className="contents absolute z-20 mt-1 max-h-48 w-full min-w-[10rem] overflow-y-auto rounded-md border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {matches.map((option, index) => <button key={option} ref={(node) => node ? optionRefs.current.set(index, node) : optionRefs.current.delete(index)} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => commit(option)} className={`block w-full px-3 py-2 text-left ${index === highlightedIndex ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{option}</button>)}
      </div>}
    </div>
  );
};

ComboBox.propTypes = { items: PropTypes.array, options: PropTypes.array, onSelect: PropTypes.func, onChange: PropTypes.func };

export { ComboBox, ComboBox as Combobox };
export default ComboBox;
