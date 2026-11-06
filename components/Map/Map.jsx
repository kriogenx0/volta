/* global google */
import React from 'react';
import PropTypes from 'prop-types';

import { EmptyState } from '../Empty/Empty';
import { getGoogleMapsKey } from './googleMapsKey';

// Google calls this global when its script has loaded.
const GOOGLE_MAPS_CALLBACK = 'voltaGoogleMapsReady';

// Maps waiting for Google's script. The script is added to the page once and
// shared by every Map: a second copy makes Google log "included multiple times".
const waiting = new Set();

const googleIsLoaded = () => Boolean(window.google && window.google.maps);

export default class Map extends React.Component {

  constructor() {
    super(...arguments);

    this.mapEl = React.createRef();
    this.googleMap = null;
    this.geocoder = null;
    this.marker = null;
    this.initialized = false;
    this.unmounted = false;
    this.initializeGoogleMap = this.initializeGoogleMap.bind(this);

    // Without a key Google refuses to load, so say so instead of showing a blank box.
    this.state = { missingKey: !googleIsLoaded() && !getGoogleMapsKey() };
  }

  componentDidMount() {
    // Must wait til loaded to run googles callback
    // Must also wait for refs to be available
    if (googleIsLoaded()) {
      this.initializeGoogleMap();
    } else if (!this.state.missingKey) {
      waiting.add(this.initializeGoogleMap);
      this.loadGoogleMapLibrary();
    }
  }

  componentDidUpdate(prevProps) {
    const { value, lat, lng } = this.props;

    if (!value && prevProps.value)
      this.removeValue();
    else if (value && prevProps.value !== value)
      this.search(value);

    // Either coordinate changing moves the marker (0 is a real coordinate).
    const moved = lat !== prevProps.lat || lng !== prevProps.lng;
    if (moved && lat != null && lng != null && this.initialized)
      this.markerOnCoordinates(lat, lng);
  }

  componentWillUnmount() {
    this.unmounted = true;
    // Don't initialize a map that is gone when Google's script finally loads.
    waiting.delete(this.initializeGoogleMap);

    // The autocomplete is bound to the caller's input, which outlives this map.
    if (this.autocomplete && window.google && google.maps.event.clearInstanceListeners)
      google.maps.event.clearInstanceListeners(this.autocomplete);
  }

  loadGoogleMapLibrary() {
    if (document.querySelector('script[data-volta-google-maps]')) return;

    window[GOOGLE_MAPS_CALLBACK] = () => {
      const ready = [...waiting];
      waiting.clear();
      ready.forEach((initialize) => initialize());
    };

    this.script = document.createElement('script');
    this.script.type = 'text/javascript';
    this.script.setAttribute('data-volta-google-maps', '');
    // Offline or blocked: drop the script so the next Map to mount can try again.
    this.script.onerror = () => this.script.remove();
    this.script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&callback=' + GOOGLE_MAPS_CALLBACK
      + '&key=' + encodeURIComponent(getGoogleMapsKey());
    document.body.appendChild(this.script);
  }

  initializeGoogleMap() {
    if (this.unmounted || !this.mapEl.current) return;

    this.geocoder = new google.maps.Geocoder();

    const initialPosition = {
      zoom: this.props.zoom,
      center: new google.maps.LatLng(this.props.lat, this.props.lng)
    };

    this.googleMap = new google.maps.Map(this.mapEl.current, initialPosition);
    this.googleMap.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    this.marker = new google.maps.Marker({ map: this.googleMap });

    // if (this.props.lat && this.props.lng)
    //   this.markerOnCoordinates(this.props.lat, this.props.lng);

    this.initialized = true;

    // Autocomplete attaches to the caller's input, so it needs addressInput.
    if (this.props.autocomplete && this.props.addressInput && google.maps.places) this.configureAutoComplete();
    if (this.props.value) this.search(this.props.value);
  }

  configureAutoComplete() {
    const addressInput = this.props.addressInput;

    if (!this.autocomplete)
      this.autocomplete = new google.maps.places.Autocomplete(addressInput, { types: ['geocode'] });

    google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
      const address = addressInput.value;
      this.search(address);
    });
  }

  // MOVE & CENTER
  markerOnCoordinates(lat, lng) {
    const location = new google.maps.LatLng(lat, lng);
    this.markerOnLocation(location);
  }

  markerOnLocation(location) {
    if (this.googleMap) this.googleMap.setCenter(location);
    if (this.marker) {
      this.marker.setMap(this.googleMap);
      this.marker.setPosition(location);
    }
  }

  setLoading(isLoading) {
    if (this.props.onLoading) this.props.onLoading(isLoading);
  }

  search(address) {
    if (!this.geocoder) return;

    this.value = address;
    this.setLoading(true);

    this.geocoder.geocode({ address }, (results, status) => {
      if (this.unmounted) return;

      // Location Found
      if (status == google.maps.GeocoderStatus.OK) {
        // console.log('results[0].geometry.location', results[0].geometry.location);
        this.markerOnLocation(results[0].geometry.location);

        this.props.onChange({
          results,
          address: results[0].formatted_address,
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });

        this.setLoading(false);
      } else {
        this.setLoading(false);
        this.props.onNotFound(address, status);
      }
    });
  }

  removeValue() {
    if (this.marker)
      this.marker.setMap(null);
  }

  render() {
    if (this.state.missingKey) {
      return (
        <div className='volta-map'>
          <EmptyState>
            Map unavailable: no Google Maps API key is set. Call setGoogleMapsKey() once at startup.
          </EmptyState>
        </div>
      );
    }

    return (
      <div className='volta-map'>
        <div ref={this.mapEl} style={{height: this.props.height}} className="l-v-top-half-spaced l-bordered" />
      </div>
    );
  }
}

Map.propTypes = {
  // An address to search for; the map centers on it and drops the marker there.
  value: PropTypes.string,
  markers: PropTypes.array,
  // Center of the map to start with. Changing them later moves the marker there.
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // Called with { results, address, lat, lng } when a search finds a place.
  onChange: PropTypes.func,
  // Called with true when a search starts and false when it finishes.
  onLoading: PropTypes.func,
  // Called with (address, status) when a search finds nothing.
  onNotFound: PropTypes.func,
  autocomplete: PropTypes.bool,
  // for autocomplete: the text input to attach Google's address suggestions to
  addressInput: PropTypes.oneOfType([PropTypes.element, PropTypes.object])
}

Map.defaultProps = {
  onChange: () => {},
  onNotFound: () => {},
  // Lebanon, Kansas (Geographic Center of US)
  // http://www.kansastravel.org/geographicalcenter.htm
  lat: 39.8097343,
  lng: -98.5556199,
  zoom: 4,
  height: 300,
  autocomplete: true
}
