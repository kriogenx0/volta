import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Button from '../Button/Button';
import Map from '../Map/Map';

import './MapSelector.scss';

export default class MapSelector extends React.Component {

  constructor(props) {
    super(props);

    // Start on defaultValue, else value: the box shows it and the map searches for it.
    const start = props.defaultValue !== null ? props.defaultValue : props.value;
    const hasStart = start !== null && start !== undefined;

    this.state = {
      searchTextField: false,
      mapValue: hasStart ? start : '',
      value: props.value,
      searchBoxValue: hasStart ? start : (props.value || ''),
      searching: false
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleAddressKeyPress = this.handleAddressKeyPress.bind(this);
    this.search = this.search.bind(this);
    this.clearAddress = this.clearAddress.bind(this);
    this.handleMapLoading = this.handleMapLoading.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNotFound = this.handleNotFound.bind(this);
    this.removeValue = this.removeValue.bind(this);
    this.inputRef = this.inputRef.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.value !== null && prevProps.value !== this.props.value)
      this.searchFor(this.props.value);
  }

  // componentWillUnmount() {
    // if (this.autocomplete) this.autocomplete.unbindAll();
  // }

  searchFor(searchValue) {
    if (searchValue === undefined) return;
    this.setState({
      searchBoxValue: searchValue,
      mapValue: searchValue
    });
  }

  search() {
    this.setState({
      mapValue: this.state.searchBoxValue
    });
  }

  clearAddress() {
    this.setState({ searchBoxValue: '' });
    if (this.searchBox) this.searchBox.focus();
  }

  removeValue() {
    this.setState({ value: null, mapValue: '' });
  }

  handleAddressKeyPress(event) {
    if (event.which == 13) { // Enter
      event.preventDefault();
      event.stopPropagation();
      this.search();
    }
  }

  handleSearchChange(e) {
    const searchBoxValue = e.target.value;
    this.setState({ searchBoxValue });
  }

  handleMapLoading(loading) {
    // console.log('LOADING', loading);
    this.setState({ loading, message: loading ? 'Loading...' : null });
  }

  handleChange(location) {
    // console.log('handleChange location', location);
    this.setState({ value: location });
    this.props.onChange(location, this.state.searchBoxValue);
  }

  // The search found no place; say so rather than leaving the map as it was.
  handleNotFound() {
    this.setState({ message: 'Location not found.' });
  }

  inputRef(input) {
    this.searchBox = input;
    if (!this.state.searchTextField)
      this.setState({ searchTextField: input });
  }

  render() {
    // onClick={/this.state.searchBoxValue ? this.clearAddress : () => {}}
    return (
      <div className='volta-map_selector'>
        <div className='clearfix'>
          <div className='l-r'>
            <Button onClick={this.search}>Search</Button>
          </div>
          <div className='map_selector-search_box'>
            <input
              type='text'
              ref={this.inputRef}
              className="l-width-full"
              onKeyPress={this.handleAddressKeyPress}
              onChange={this.handleSearchChange}
              value={this.state.searchBoxValue}
              placeholder={this.props.placeholder}
              aria-label={this.props.placeholder}
            />
          </div>
        </div>
        {(() => {
          const locationAddress = _.get(this.state.value, 'address');
          if (locationAddress) {
            return (
              <div className='map_selector-location_found clearfix l-space-quarter-v'>
                <span>{locationAddress}</span>
                <Button onClick={this.removeValue} aria-label="Remove location">X</Button>
              </div>
            );
          }
        })()}
        {(() => {
          if (this.state.message) {
            return (
              <div className="l-space-v-half">
                <span>{this.state.message}</span>
              </div>
            );
          }
        })()}

        {(() => {
          if (this.state.searchTextField)
            return (
              <Map
                value={this.state.mapValue}
                onLoading={this.handleMapLoading}
                onChange={this.handleChange}
                onNotFound={this.handleNotFound}
                addressInput={this.state.searchTextField}
              />
            );
        })()}
      </div>
    );
  }
}

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

MapSelector.defaultProps = {
  defaultValue: null,
  value: null,
  placeholder: 'Enter a street address...',
  onChange: ()=>{}
};
