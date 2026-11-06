import { render, screen, fireEvent, act } from '@testing-library/react';

import MapSelector from '../../components/MapSelector/MapSelector';
import { setGoogleMapsKey } from '../../components/Map/googleMapsKey';
import { installGoogleMaps, uninstallGoogleMaps, removeGoogleScript } from '../Map/fakeGoogleMaps';

const searchBox = () => screen.getByRole('textbox');
const type = (text) => fireEvent.change(searchBox(), { target: { value: text } });
const clickSearch = () => fireEvent.click(screen.getByRole('button', { name: 'Search' }));

beforeEach(() => setGoogleMapsKey('test-key'));

afterEach(() => {
  uninstallGoogleMaps();
  removeGoogleScript();
  setGoogleMapsKey(null);
});

describe('MapSelector without a Google Maps key', () => {
  beforeEach(() => setGoogleMapsKey(null));

  it('keeps the search box and says the map is unavailable', () => {
    render(<MapSelector />);
    expect(searchBox()).toBeInTheDocument();
    expect(screen.getByText(/no Google Maps API key is set/i)).toBeInTheDocument();
  });

  it('does not load Google\'s script, and searching does not throw', () => {
    render(<MapSelector value="Paris" />);
    expect(document.querySelector('script[data-volta-google-maps]')).toBeNull();
    expect(() => clickSearch()).not.toThrow();
  });
});

describe('MapSelector', () => {
  it('renders a search box and a Search button', () => {
    render(<MapSelector />);
    expect(searchBox()).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('shows the default placeholder and names the box after it', () => {
    render(<MapSelector />);
    expect(searchBox()).toHaveAttribute('placeholder', 'Enter a street address...');
    expect(screen.getByLabelText('Enter a street address...')).toBe(searchBox());
  });

  it('takes a custom placeholder', () => {
    render(<MapSelector placeholder="Find a store" />);
    expect(searchBox()).toHaveAttribute('placeholder', 'Find a store');
    expect(screen.getByLabelText('Find a store')).toBe(searchBox());
  });

  it('starts with an empty search box', () => {
    render(<MapSelector />);
    expect(searchBox()).toHaveValue('');
  });

  it('shows what is typed', () => {
    render(<MapSelector />);
    type('12 Elm St');
    expect(searchBox()).toHaveValue('12 Elm St');
  });

  it('shows the map under the search box', () => {
    const { container } = render(<MapSelector />);
    expect(container.querySelector('.volta-map')).toBeInTheDocument();
  });

  describe('starting address', () => {
    it('fills the box with value and searches for it', () => {
      const made = installGoogleMaps();
      render(<MapSelector value="1 Main St" />);
      expect(searchBox()).toHaveValue('1 Main St');
      expect(made.requests).toEqual(['1 Main St']);
    });

    it('fills the box with defaultValue and searches for it', () => {
      const made = installGoogleMaps();
      render(<MapSelector defaultValue="2 Side St" />);
      expect(searchBox()).toHaveValue('2 Side St');
      expect(made.requests).toEqual(['2 Side St']);
    });

    it('prefers defaultValue over value', () => {
      installGoogleMaps();
      render(<MapSelector defaultValue="2 Side St" value="1 Main St" />);
      expect(searchBox()).toHaveValue('2 Side St');
    });

    it('searches again when value changes', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<MapSelector value="1 Main St" />);
      rerender(<MapSelector value="9 Other Rd" />);
      expect(searchBox()).toHaveValue('9 Other Rd');
      expect(made.requests).toEqual(['1 Main St', '9 Other Rd']);
    });

    it('leaves the box alone when an unrelated prop changes', () => {
      const made = installGoogleMaps();
      const { rerender } = render(<MapSelector value="1 Main St" />);
      type('typed since');
      rerender(<MapSelector value="1 Main St" placeholder="Another" />);
      expect(searchBox()).toHaveValue('typed since');
      expect(made.requests).toEqual(['1 Main St']);
    });
  });

  describe('searching', () => {
    it('does not search until Search is clicked', () => {
      const made = installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      expect(made.requests).toEqual([]);
    });

    it('searches for the typed address when Search is clicked', () => {
      const made = installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      clickSearch();
      expect(made.requests).toEqual(['Paris']);
    });

    it('searches when Enter is pressed in the box', () => {
      const made = installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      fireEvent.keyPress(searchBox(), { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(made.requests).toEqual(['Paris']);
    });

    it('does not search for other keys', () => {
      const made = installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      fireEvent.keyPress(searchBox(), { key: 'a', code: 'KeyA', charCode: 97 });
      expect(made.requests).toEqual([]);
    });

    it('shows the address that was found', () => {
      installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      clickSearch();
      expect(screen.getByText('Paris, USA')).toBeInTheDocument();
    });

    it('calls onChange with the place and the text that was searched', () => {
      installGoogleMaps();
      const onChange = jest.fn();
      render(<MapSelector onChange={onChange} />);
      type('Paris');
      clickSearch();
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ address: 'Paris, USA', lat: 40.7, lng: -74 }), 'Paris');
    });

    it('says when nothing was found and does not call onChange', () => {
      installGoogleMaps();
      const onChange = jest.fn();
      render(<MapSelector onChange={onChange} />);
      type('nowhere land');
      clickSearch();
      expect(screen.getByText('Location not found.')).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('clears the not-found message on the next successful search', () => {
      installGoogleMaps();
      render(<MapSelector />);
      type('nowhere land');
      clickSearch();
      type('Paris');
      clickSearch();
      expect(screen.queryByText('Location not found.')).toBeNull();
      expect(screen.getByText('Paris, USA')).toBeInTheDocument();
    });

    it('shows Loading... while Google is answering', () => {
      const made = installGoogleMaps({ async: true });
      render(<MapSelector />);
      type('Paris');
      clickSearch();
      expect(screen.getByText('Loading...')).toBeInTheDocument();

      act(() => made.pending.forEach((answer) => answer()));

      expect(screen.queryByText('Loading...')).toBeNull();
      expect(screen.getByText('Paris, USA')).toBeInTheDocument();
    });
  });

  describe('removing the location', () => {
    it('names the remove button', () => {
      installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      clickSearch();
      expect(screen.getByRole('button', { name: 'Remove location' })).toBeInTheDocument();
    });

    it('clears the found address and takes the marker off the map', () => {
      const made = installGoogleMaps();
      render(<MapSelector />);
      type('Paris');
      clickSearch();
      expect(made.markers[0].map).not.toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Remove location' }));

      expect(screen.queryByText('Paris, USA')).toBeNull();
      expect(screen.queryByRole('button', { name: 'Remove location' })).toBeNull();
      expect(made.markers[0].map).toBeNull();
    });
  });
});
