import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink, useMatch } from 'react-router-dom';

import './Tabs.scss';
import { map } from '../../util/collection';

// A strip of tabs. `tabs` is an array of labels or an object of key -> label. A tab is
// a string or other node, an element carrying a `label` prop, or a `{ path, name }`
// pair, which is a router link and is selected while the route matches.
//
// Selection, in three ways:
//   selectedTabKey    the key of the chosen tab (an index, for an array); the parent
//                     decides, so a click only calls onSelect
//   selectedTabIndex  the index to start on and to move to when it changes; clicks
//                     also move the selection (the parent may not track it)
//   neither           the first tab is chosen to start, and clicks move it
//
// For the keyboard it is a tab list: one tab is in the tab order (the selected one,
// or the first when none is selected), the arrow keys move between tabs, Home and
// End jump to the ends, and Enter or Space chooses the focused one. The arrows only
// move focus, they don't choose, so `onSelect` is never fired by browsing. Router
// links are plain links and take Tab as links do.

const isRouted = (tab) => Boolean(tab) && typeof tab === 'object' && !React.isValidElement(tab) && typeof tab.path === 'string';

// What a tab says: a string or node as it is, or the `label` of an element, or the
// `name` of a routed pair.
const tabLabel = (tab) => {
  if (isRouted(tab)) return tab.name ?? tab.label;
  if (React.isValidElement(tab) && tab.props.label !== undefined) return tab.props.label;
  return tab;
};

// A router link as a tab. The "/" tab only matches the root itself, so it isn't
// selected on every page.
const RoutedTab = ({ tab }) => {
  const end = tab.path === '/';
  const selected = Boolean(useMatch({ path: tab.path, end }));

  return (
    <li className={'tab' + (selected ? ' tab-selected' : '')}>
      <NavLink to={tab.path} end={end} className="tab-link">{tabLabel(tab)}</NavLink>
    </li>
  );
};

RoutedTab.propTypes = { tab: PropTypes.object.isRequired };

const Tabs = ({ tabs, selectedTabKey, selectedTabIndex, onSelect, onChange, align = 'left' }) => {
  const listRef = useRef(null);
  // Where the bar under the selected tab is; null until measured. It only slides after it has
  // first been placed, so it doesn't fly in from the corner on the first paint.
  const [bar, setBar] = useState(null);
  const [slide, setSlide] = useState(false);

  const entries = map(tabs, (tab, key) => ({ tab, key }));
  const routedTabs = entries.some(({ tab }) => isRouted(tab));

  // Where the selection is kept when the parent doesn't decide it
  const keyAtIndex = (index) => (typeof index === 'number' && entries[index] ? entries[index].key : undefined);
  const [pickedKey, setPickedKey] = useState(() => keyAtIndex(selectedTabIndex) ?? (entries[0] && entries[0].key));

  // A parent that changes selectedTabIndex moves the selection with it
  useEffect(() => {
    const key = keyAtIndex(selectedTabIndex);
    if (key !== undefined) setPickedKey(key);
  }, [selectedTabIndex]);

  const selectedKey = selectedTabKey !== undefined ? selectedTabKey : pickedKey;
  const selectedIndex = entries.findIndex(({ key }) => key === selectedKey);
  // The one tab that Tab lands on
  const tabbableIndex = selectedIndex >= 0 ? selectedIndex : 0;

  const measureBar = () => {
    const selected = listRef.current && listRef.current.querySelector('.tab-selected');
    const next = selected ? { left: selected.offsetLeft, width: selected.offsetWidth } : null;
    // Keep the old object when nothing moved, or setting it would render again forever
    setBar((prev) => (prev && next && prev.left === next.left && prev.width === next.width ? prev : next));
  };

  // After every render: the selection, the labels or the width may have moved it.
  useLayoutEffect(() => { if (listRef.current) measureBar(); });

  useEffect(() => {
    if (!listRef.current || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measureBar);
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => { if (bar) setSlide(true); }, [Boolean(bar)]);

  const handleSelect = (tab, key, index) => {
    if (selectedTabKey === undefined) setPickedKey(key);
    if (onSelect) onSelect(key, tab);
    if (onChange) onChange(index, tabLabel(tab));
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
        handleSelect(tab, key, index);
        break;
      default:
    }
  };

  return (
    <div className={'volta-tabs tab-align-' + align.toLowerCase()}>
      <nav>
        <ul role={routedTabs ? undefined : 'tablist'} ref={listRef}>
          {entries.map(({ tab, key }, index) => {
            if (isRouted(tab)) return <RoutedTab key={tab.path} tab={tab} />;

            return (
              <li
                key={key}
                role="tab"
                aria-selected={key === selectedKey}
                tabIndex={index === tabbableIndex ? 0 : -1}
                onClick={() => handleSelect(tab, key, index)}
                onKeyDown={(event) => handleKeyDown(event, index, tab, key)}
                className={'tab' + (key === selectedKey ? ' tab-selected' : '')}
              >
                {tabLabel(tab)}
              </li>
            );
          })}
          {/* The bar under the selected tab. Its position and width are measured, so they are inline. */}
          {bar && (
            <span
              aria-hidden="true"
              className={`tab-indicator${slide ? ' tab-indicator--slide' : ''}`}
              style={{ width: bar.width, transform: `translateX(${bar.left}px)` }}
            />
          )}
        </ul>
      </nav>
    </div>
  );
};

Tabs.propTypes = {
  // Labels, elements with a `label` prop, or { path, name } pairs; as an array or an object of key -> label
  tabs: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  // The chosen tab's key (its index for an array). The parent decides; a click only calls onSelect.
  selectedTabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // The index to start on and to move to when it changes; clicks also move the selection
  selectedTabIndex: PropTypes.number,
  // (key, tab) when a tab is chosen
  onSelect: PropTypes.func,
  // (index, label) when a tab is chosen
  onChange: PropTypes.func,
  align: PropTypes.string
};

// TabBar and TabsRouted are other names for Tabs, kept for existing callers.
const TabBar = Tabs;
const TabsRouted = Tabs;

export { Tabs, TabBar, TabsRouted };
export default Tabs;
