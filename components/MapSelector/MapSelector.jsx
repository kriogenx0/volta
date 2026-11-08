import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../Button/Button';
import Map from '../Map/Map';

import './MapSelector.scss';

const MapSelector = ({
  value = null,
  defaultValue = null,
  placeholder = 'Enter a street address...',
  onChange = () => {}
}) => {
  // Start on defaultValue, else value: the box shows it and the map searches for it.
  const start = defaultValue !== null ? defaultValue : value;
  const hasStart = start !== null && start !== undefined;

  // The map needs the search box element (it attaches Places autocomplete to it), so it
  // is rendered once the box exists.
  const [searchTextField, setSearchTextField] = useState(null);
  const [mapValue, setMapValue] = useState(hasStart ? start : '');
  const [location, setLocation] = useState(null);
  const [searchBoxValue, setSearchBoxValue] = useState(hasStart ? start : (value || ''));
  const [message, setMessage] = useState(null);

  // The map reports back later, so what it calls reads the latest box text and onChange.
  const searchBoxValueRef = useRef(searchBoxValue);
  const onChangeRef = useRef(onChange);
  searchBoxValueRef.current = searchBoxValue;
  onChangeRef.current = onChange;

  // Search again whenever the value prop changes (not on the first render, which started on it).
  const previousValue = useRef(value);
  useEffect(() => {
    if (value === previousValue.current) return;
    previousValue.current = value;
    if (value !== null) {
      setSearchBoxValue(value);
      setMapValue(value);
    }
  }, [value]);

  const search = () => setMapValue(searchBoxValue);

  const removeValue = () => {
    setLocation(null);
    setMapValue('');
  };

  const handleAddressKeyPress = (event) => {
    if (event.which === 13) { // Enter
      event.preventDefault();
      event.stopPropagation();
      search();
    }
  };

  const handleMapLoading = useCallback((loading) => {
    setMessage(loading ? 'Loading...' : null);
  }, []);

  const handleChange = useCallback((found) => {
    setLocation(found);
    onChangeRef.current(found, searchBoxValueRef.current);
  }, []);

  // The search found no place; say so rather than leaving the map as it was.
  const handleNotFound = useCallback(() => {
    setMessage('Location not found.');
  }, []);

  const locationAddress = _.get(location, 'address');

  return (
    <div className='volta-map_selector'>
      <div className='clearfix'>
        <div className='l-r'>
          <Button onClick={search}>Search</Button>
        </div>
        <div className='map_selector-search_box'>
          <input
            type='text'
            ref={setSearchTextField}
            className="l-width-full"
            onKeyPress={handleAddressKeyPress}
            onChange={(e) => setSearchBoxValue(e.target.value)}
            value={searchBoxValue}
            placeholder={placeholder}
            aria-label={placeholder}
          />
        </div>
      </div>
      {locationAddress ? (
        <div className='map_selector-location_found clearfix l-space-quarter-v'>
          <span>{locationAddress}</span>
          <Button onClick={removeValue} aria-label="Remove location">X</Button>
        </div>
      ) : null}
      {message ? (
        <div className="l-space-v-half">
          <span>{message}</span>
        </div>
      ) : null}
      {searchTextField ? (
        <Map
          value={mapValue}
          onLoading={handleMapLoading}
          onChange={handleChange}
          onNotFound={handleNotFound}
          addressInput={searchTextField}
        />
      ) : null}
    </div>
  );
};

MapSelector.propTypes = {
  // An address to start on and to search for again whenever it changes.
  value: PropTypes.string,
  // An address to start on that later changes to the prop don't override.
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  // Called with the found place ({ address, lat, lng, results }) and the text
  // that was in the search box.
  onChange: PropTypes.func
};

export default MapSelector;
