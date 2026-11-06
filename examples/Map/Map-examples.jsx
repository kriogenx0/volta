import { useState } from 'react';

import Map from '../../components/Map/Map';
import Button from '../../components/Button/Button';
import TextField from '../../components/TextField/TextField';

const PLACES = {
  Paris: { lat: 48.8566, lng: 2.3522 },
  Tokyo: { lat: 35.6762, lng: 139.6503 },
  Sydney: { lat: -33.8688, lng: 151.2093 }
};

// Your own search box next to the map: Map only searches when value changes.
const AddressSearch = () => {
  const [draft, setDraft] = useState('Eiffel Tower, Paris');
  const [address, setAddress] = useState('');
  const [found, setFound] = useState('');
  const [message, setMessage] = useState('');

  const search = () => {
    setMessage('');
    setAddress(draft);
  };

  return (
    <div className="example-stack">
      <TextField label="Address" value={draft} onChange={(e) => setDraft(e.target.value)} />
      <div>
        <Button variant="primary" onClick={search}>Find on map</Button>
      </div>
      <Map
        value={address}
        height={240}
        onChange={(place) => setFound(`${place.address} (${place.lat.toFixed(4)}, ${place.lng.toFixed(4)})`)}
        onNotFound={() => setMessage('Location not found.')}
      />
      <p>{message || (found ? `Found: ${found}` : 'Search to drop a marker on the map.')}</p>
    </div>
  );
};

// Changing lat and lng after the map starts re-centers it and drops the marker there.
const Jump = () => {
  const [place, setPlace] = useState('Paris');
  const { lat, lng } = PLACES[place];

  return (
    <div className="example-stack">
      <div>
        {Object.keys(PLACES).map((name) => (
          <Button key={name} variant={name === place ? 'primary' : 'default'} onClick={() => setPlace(name)}>{name}</Button>
        ))}
      </div>
      <Map lat={lat} lng={lng} zoom={10} height={240} />
    </div>
  );
};

export default {
  name: 'Map',
  description: 'A Google Map you drive with props: lat, lng and zoom set the view, height sets its size, and value searches for an address and drops a marker on it (onChange, onNotFound and onLoading report the outcome). It loads Google\'s Maps script once for the whole page, so it needs a network connection and an API key: the app calls setGoogleMapsKey(key) once at startup, and without one the map is replaced by a message. In this styleguide, put VITE_GOOGLE_MAPS_API_KEY=your-key in .env.local to see live maps (docs/features/map.md).',
  examples: [
    {
      name: 'Default view',
      code: '<Map />',
      output: <Map />
    },
    {
      name: 'City view with a custom zoom and height',
      code: '<Map lat={48.8566} lng={2.3522} zoom={12} height={200} />',
      output: <Map lat={48.8566} lng={2.3522} zoom={12} height={200} />
    },
    {
      name: 'Search for an address',
      code: `const [address, setAddress] = useState('');

<TextField label="Address" value={draft} onChange={(e) => setDraft(e.target.value)} />
<Button onClick={() => setAddress(draft)}>Find on map</Button>
<Map
  value={address}
  height={240}
  onChange={(place) => setFound(place.address)}
  onNotFound={() => setMessage('Location not found.')}
/>`,
      output: <AddressSearch />
    },
    {
      name: 'Move the marker with lat and lng',
      code: `const { lat, lng } = PLACES[place];

<Map lat={lat} lng={lng} zoom={10} height={240} />`,
      output: <Jump />
    }
  ]
};
