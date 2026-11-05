import { render, act } from '@testing-library/react';

import Map from '../../components/Map/Map';
import { installGoogleMaps, uninstallGoogleMaps, removeGoogleScript } from './fakeGoogleMaps';

const mapElement = (container) => container.querySelector('.volta-map > div');

afterEach(() => {
  uninstallGoogleMaps();
  removeGoogleScript();
});

describe('Map without Google loaded', () => {
  it('renders an empty map container at the default height', () => {
    const { container } = render(<Map />);
    expect(mapElement(container)).toBeInTheDocument();
    expect(mapElement(container)).toHaveStyle({ height: '300px' });
  });

  it('takes a custom height', () => {
    const { container } = render(<Map height={180} />);
    expect(mapElement(container)).toHaveStyle({ height: '180px' });
  });

  it('adds Google\'s script to the page', () => {
    render(<Map />);
    const scripts = document.querySelectorAll('script[data-volta-google-maps]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].src).toContain('https://maps.googleapis.com/maps/api/js');
    expect(scripts[0].src).toContain('libraries=places');
    expect(scripts[0].src).toContain('callback=voltaGoogleMapsReady');
  });

  it('loads the script once however many maps are on the page', () => {
    render(<><Map /><Map /><Map /></>);
    expect(document.querySelectorAll('script[data-volta-google-maps]')).toHaveLength(1);
  });

  it('starts every waiting map when the script loads', () => {
    const { container } = render(<><Map lat={10} lng={20} /><Map lat={30} lng={40} zoom={9} /></>);
    const made = installGoogleMaps();

    act(() => window.voltaGoogleMapsReady());

    expect(made.maps).toHaveLength(2);
    expect(made.maps.map((map) => map.options.zoom)).toEqual([4, 9]);
    expect(made.maps[0].element).toBe(container.querySelectorAll('.volta-map > div')[0]);
  });

  it('does not start a map that unmounted before the script loaded', () => {
    const { unmount } = render(<Map />);
    unmount();
    const made = installGoogleMaps();

    expect(() => act(() => window.voltaGoogleMapsReady())).not.toThrow();

    expect(made.maps).toHaveLength(0);
  });

  it('removes the script again if it fails to load so another map can retry', () => {
    render(<Map />);
    const script = document.querySelector('script[data-volta-google-maps]');

    act(() => script.onerror());

    expect(document.querySelector('script[data-volta-google-maps]')).toBeNull();
  });
});

describe('Map with Google loaded', () => {
  it('starts straight away, without adding the script', () => {
    const made = installGoogleMaps();
    render(<Map />);
    expect(made.maps).toHaveLength(1);
    expect(document.querySelector('script[data-volta-google-maps]')).toBeNull();
  });

  it('centers on the middle of the US at zoom 4 by default', () => {
    const made = installGoogleMaps();
    render(<Map />);
    const [map] = made.maps;
    expect(map.options.zoom).toBe(4);
    expect(map.options.center.lat()).toBeCloseTo(39.8097343);
    expect(map.options.center.lng()).toBeCloseTo(-98.5556199);
    expect(map.setMapTypeId).toHaveBeenCalledWith('roadmap');
  });

  it('centers on the lat, lng and zoom it is given', () => {
    const made = installGoogleMaps();
    render(<Map lat={48.85} lng={2.35} zoom={11} />);
    const [map] = made.maps;
    expect(map.options.zoom).toBe(11);
    expect(map.options.center.lat()).toBe(48.85);
    expect(map.options.center.lng()).toBe(2.35);
  });

  it('draws the map into its container', () => {
    const made = installGoogleMaps();
    const { container } = render(<Map />);
    expect(made.maps[0].element).toBe(mapElement(container));
  });

  it('does not place a marker until there is somewhere to put it', () => {
    const made = installGoogleMaps();
    render(<Map />);
    expect(made.markers[0].position).toBeNull();
  });

  describe('address suggestions', () => {
    it('attaches Google\'s autocomplete to addressInput', () => {
      const made = installGoogleMaps();
      const input = document.createElement('input');
      render(<Map addressInput={input} />);
      expect(made.autocompletes).toHaveLength(1);
      expect(made.autocompletes[0].input).toBe(input);
      expect(made.autocompletes[0].options).toEqual({ types: ['geocode'] });
    });

    it('skips autocomplete when it is turned off', () => {
      const made = installGoogleMaps();
      render(<Map autocomplete={false} addressInput={document.createElement('input')} />);
      expect(made.autocompletes).toHaveLength(0);
    });

    // autocomplete defaults to true, but Google throws when it has no input.
    it('starts without error when there is no addressInput', () => {
      const made = installGoogleMaps();
      expect(() => render(<Map />)).not.toThrow();
      expect(made.autocompletes).toHaveLength(0);
      expect(made.maps).toHaveLength(1);
    });

    it('searches for the text in the input when a suggestion is picked', () => {
      const made = installGoogleMaps();
      const onChange = jest.fn();
      const input = document.createElement('input');
      render(<Map addressInput={input} onChange={onChange} />);

      input.value = '10 Main St';
      act(() => made.listeners.find((listener) => listener.name === 'place_changed').handler());

      expect(made.requests).toEqual(['10 Main St']);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ address: '10 Main St, USA', lat: 40.7, lng: -74 }));
    });

    it('stops listening to the input when the map unmounts', () => {
      const made = installGoogleMaps();
      const { unmount } = render(<Map addressInput={document.createElement('input')} />);
      expect(made.listeners).toHaveLength(1);

      unmount();

      expect(made.listeners).toHaveLength(0);
    });
  });

  describe('searching for a value', () => {
    it('searches on start, moves to the place and reports it', () => {
      const made = installGoogleMaps();
      const onChange = jest.fn();
      render(<Map value="1 Infinite Loop" onChange={onChange} />);

      expect(made.requests).toEqual(['1 Infinite Loop']);
      expect(made.markers[0].position.lat()).toBe(40.7);
      expect(made.maps[0].center.lng()).toBe(-74);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
        address: '1 Infinite Loop, USA',
        lat: 40.7,
        lng: -74,
        results: expect.any(Array)
      }));
    });

    it('tells onLoading when a search starts and finishes', () => {
      installGoogleMaps();
      const onLoading = jest.fn();
      render(<Map value="1 Infinite Loop" onLoading={onLoading} />);
      expect(onLoading.mock.calls).toEqual([[true], [false]]);
    });

    it('searches again when the value changes', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map value="First St" />);
      rerender(<Map value="Second St" />);
      expect(made.requests).toEqual(['First St', 'Second St']);
    });

    it('does not search again for an unchanged value', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map value="First St" />);
      rerender(<Map value="First St" height={200} />);
      expect(made.requests).toEqual(['First St']);
    });

    it('removes the marker when the value is cleared', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map value="First St" />);
      expect(made.markers[0].map).not.toBeNull();

      rerender(<Map value="" />);

      expect(made.markers[0].map).toBeNull();
    });

    // A place picked from the suggestions is not in the value prop. Re-rendering
    // with an empty value afterwards used to wipe its marker.
    it('keeps a marker it placed itself when the parent re-renders with no value', () => {
      const made = installGoogleMaps();
      const input = document.createElement('input');
      input.value = '10 Main St';
      const { rerender } = render(<Map addressInput={input} />);
      act(() => made.listeners[0].handler());
      expect(made.markers[0].map).not.toBeNull();

      rerender(<Map addressInput={input} height={250} />);

      expect(made.markers[0].map).not.toBeNull();
    });

    it('reports a search with no results through onNotFound and onLoading', () => {
      installGoogleMaps();
      const onChange = jest.fn();
      const onNotFound = jest.fn();
      const onLoading = jest.fn();
      render(<Map value="nowhere at all" onChange={onChange} onNotFound={onNotFound} onLoading={onLoading} />);

      expect(onNotFound).toHaveBeenCalledWith('nowhere at all', 'ZERO_RESULTS');
      expect(onChange).not.toHaveBeenCalled();
      expect(onLoading).toHaveBeenLastCalledWith(false);
    });

    it('ignores Google\'s answer if it arrives after the map unmounted', () => {
      const made = installGoogleMaps({ async: true });
      const onChange = jest.fn();
      const { unmount } = render(<Map value="Slow St" onChange={onChange} />);
      unmount();

      act(() => made.pending.forEach((answer) => answer()));

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('moving the marker with lat and lng', () => {
    it('moves the marker when both change', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map lat={10} lng={20} />);
      rerender(<Map lat={30} lng={40} />);
      expect(made.markers[0].position.lat()).toBe(30);
      expect(made.markers[0].position.lng()).toBe(40);
    });

    it('moves the marker when only lat changes', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map lat={10} lng={20} />);
      rerender(<Map lat={11} lng={20} />);
      expect(made.markers[0].position.lat()).toBe(11);
      expect(made.markers[0].position.lng()).toBe(20);
    });

    it('moves the marker when only lng changes', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map lat={10} lng={20} />);
      rerender(<Map lat={10} lng={21} />);
      expect(made.markers[0].position.lng()).toBe(21);
    });

    it('accepts 0 as a coordinate', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map lat={10} lng={20} />);
      rerender(<Map lat={0} lng={0} />);
      expect(made.markers[0].position.lat()).toBe(0);
      expect(made.markers[0].position.lng()).toBe(0);
    });

    it('centers the map on the marker', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<Map lat={10} lng={20} />);
      rerender(<Map lat={30} lng={40} />);
      expect(made.maps[0].center.lat()).toBe(30);
    });
  });
});
