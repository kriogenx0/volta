// Searches one or more "stores" and lets the user toggle results.
//
// NOT wired into this library's index.js: `stores` is expected to be a
// list of Backbone-style stores (addChangeListener/removeChangeListener,
// getCollection().models, actions.objectListSearch) that don't exist in
// this repo. Kept for reference/future rewrite against a real data layer.
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ListHeader from '../List/list-header';

const SearchStore = ({ stores, headers, placeholder, selectedModels, addResult, removeResult, filterResults }) => {
  const inputRef = useRef(null);
  const [results, setResults] = useState(() => stores.map(() => []));
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadResults = useCallback((storeIndex) => {
    setResults((prev) => {
      const next = [...prev];
      next[storeIndex] = filterResults(stores[storeIndex].getCollection().models);
      return next;
    });
  }, [stores, filterResults]);

  const search = useCallback(() => {
    setLoading(true);
    stores.forEach((store) => {
      store.actions.objectListSearch({ search: inputRef.current.value });
    });
  }, [stores]);

  const debouncedSearch = useRef(_.debounce(search, 200));

  const handleToggle = useCallback((event) => {
    if (event) {
      event.stopPropagation();
      if (event.target.nodeName === 'INPUT' && focused) return;
    }

    setFocused((prev) => {
      const next = !prev;
      if (!next) window.removeEventListener('click', handleToggle);
      else window.addEventListener('click', handleToggle);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused]);

  useEffect(() => {
    const listeners = stores.map((store, index) => {
      const listener = () => loadResults(index);
      store.addChangeListener(listener);
      return listener;
    });

    return () => {
      stores.forEach((store, index) => store.removeChangeListener(listeners[index]));
      window.removeEventListener('click', handleToggle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event) => {
    event.preventDefault();
    debouncedSearch.current();
  };

  const toggleResult = (result, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (selectedModels.includes(result)) removeResult(result);
    else addResult(result);
  };

  const handleClearClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    inputRef.current.value = '';
    inputRef.current.focus();
    debouncedSearch.current();
  };

  const noResults = results.reduce((memo, r) => memo + r.length, 0) === 0;

  const formattedResults = [];
  results.forEach((store, i) => {
    formattedResults.push(<ListHeader title={headers[i]} key={`header-${i}`} />);
    store.forEach((result) => {
      formattedResults.push(
        <li className="lst_row" key={result.get('uuid')} onClick={(e) => toggleResult(result, e)}>
          <a href="#">
            {result.get('name')}
          </a>
        </li>
      );
    });
  });

  return (
    <div className={`twd ${focused ? 'is-open' : ''} ${loading ? 'is-loading' : ''}`}>
      <div className="inp inp-has-clear">
        <a href="#" className="inp_clear" onClick={handleClearClick}></a>
        <input
          className="txt twd_input l-full-width inp_field"
          ref={inputRef}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleToggle}
        />
      </div>
      <div className="twd_dropdown ddn">
        <div className="twd_dropdown_scroll l-v-half-padded">
          <ul className="lst lst-multiselect lst-simple">
            {noResults
              ? <li className="lst_row l-h-half-padded"><p className="deemphasized">No matches.</p></li>
              : formattedResults}
          </ul>
        </div>
      </div>
    </div>
  );
};

SearchStore.propTypes = {
  stores: PropTypes.array,
  headers: PropTypes.array,
  placeholder: PropTypes.string,
  queryParams: PropTypes.object,
  selectedModels: PropTypes.array,
  addResult: PropTypes.func,
  removeResult: PropTypes.func,
  filterResults: PropTypes.func
};

SearchStore.defaultProps = {
  stores: [],
  headers: [],
  placeholder: '',
  queryParams: {},
  selectedModels: [],
  addResult: () => {},
  removeResult: () => {},
  filterResults: (results) => results
};

export default SearchStore;
