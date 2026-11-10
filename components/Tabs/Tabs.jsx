import { useRef } from 'react';
import PropTypes from 'prop-types';

import './Tabs.scss';
import { map } from '../../util/collection';

// A strip of tabs: `tabs` is an array of labels or an object of key -> label, and
// `selectedTabKey` is the key of the chosen one (an index, for an array).
//
// For the keyboard it is a tab list: one tab is in the tab order (the selected one,
// or the first when none is selected), the arrow keys move between tabs, Home and
// End jump to the ends, and Enter or Space chooses the focused one. The arrows only
// move focus, they don't choose, so `onSelect` is never fired by browsing.
const Tabs = ({ tabs, selectedTabKey, onSelect, align = 'left' }) => {
  const listRef = useRef(null);

  const entries = map(tabs, (tab, key) => ({ tab, key }));
  const selectedIndex = entries.findIndex(({ key }) => key === selectedTabKey);
  // The one tab that Tab lands on
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const handleSelect = (tab, key) => {
    onSelect && onSelect(key, tab);
  };

  const focusTab = (index) => {
    const nodes = listRef.current ? listRef.current.querySelectorAll('[role="tab"]') : [];
    if (nodes.length) nodes[(index + nodes.length) % nodes.length].focus();
  };

  const handleKeyDown = (event, index, tab, key) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        focusTab(index + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusTab(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(entries.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleSelect(tab, key);
        break;
      default:
    }
  };

  return (
    <div className={'volta-tabs tab-align-' + align.toLowerCase()}>
      <nav>
        <ul role="tablist" ref={listRef}>
          {entries.map(({ tab, key }, index) => (
            <li
              key={tab}
              role="tab"
              aria-selected={key === selectedTabKey}
              tabIndex={index === tabbableIndex ? 0 : -1}
              onClick={handleSelect.bind(null, tab, key)}
              onKeyDown={(event) => handleKeyDown(event, index, tab, key)}
              className={'tab' + (key === selectedTabKey ? ' tab-selected' : '')}
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  selectedTabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  align: PropTypes.string,
  activeClassName: PropTypes.string
};

export default Tabs;
