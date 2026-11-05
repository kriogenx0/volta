// A stand-in for the parts of Google's Maps JavaScript API that Map uses, so
// tests can run offline. installGoogleMaps() puts it on window.google and
// returns what the component created so tests can look at it.

export const OK = 'OK';
export const ZERO_RESULTS = 'ZERO_RESULTS';

class LatLng {
  constructor(lat, lng) {
    this.latValue = lat;
    this.lngValue = lng;
  }

  lat() { return this.latValue; }

  lng() { return this.lngValue; }
}

// Addresses containing "nowhere" are not found; everything else lands at 40.7, -74.
export const defaultGeocode = (address) => (
  /nowhere/i.test(address)
    ? { results: [], status: ZERO_RESULTS }
    : { results: [{ formatted_address: `${address}, USA`, geometry: { location: new LatLng(40.7, -74) } }], status: OK }
);

export const installGoogleMaps = ({ geocode = defaultGeocode, async = false } = {}) => {
  const made = { maps: [], markers: [], autocompletes: [], requests: [], listeners: [], pending: [] };

  class FakeMap {
    constructor(element, options) {
      this.element = element;
      this.options = options;
      this.center = options.center;
      this.setMapTypeId = jest.fn();
      made.maps.push(this);
    }

    setCenter(location) { this.center = location; }
  }

  class Marker {
    constructor({ map }) {
      this.map = map;
      this.position = null;
      made.markers.push(this);
    }

    setMap(map) { this.map = map; }

    setPosition(position) { this.position = position; }
  }

  class Geocoder {
    geocode(request, callback) {
      made.requests.push(request.address);
      const answer = () => {
        const { results, status } = geocode(request.address);
        callback(results, status);
      };
      // async lets a test decide when Google answers.
      if (async) made.pending.push(answer);
      else answer();
    }
  }

  class Autocomplete {
    constructor(input, options) {
      this.input = input;
      this.options = options;
      made.autocompletes.push(this);
    }
  }

  window.google = {
    maps: {
      Map: FakeMap,
      Marker,
      Geocoder,
      LatLng,
      MapTypeId: { ROADMAP: 'roadmap' },
      GeocoderStatus: { OK, ZERO_RESULTS },
      places: { Autocomplete },
      event: {
        addListener: (target, name, handler) => made.listeners.push({ target, name, handler }),
        clearInstanceListeners: jest.fn((target) => {
          made.listeners = made.listeners.filter((listener) => listener.target !== target);
        })
      }
    }
  };

  return made;
};

export const uninstallGoogleMaps = () => {
  delete window.google;
};

// Drops everything Map adds to the page while it waits for Google's script.
export const removeGoogleScript = () => {
  document.querySelectorAll('script[data-volta-google-maps]').forEach((script) => script.remove());
  delete window.voltaGoogleMapsReady;
};
