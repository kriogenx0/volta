import { useState } from 'react';

import MapSelector from '../../components/MapSelector/MapSelector';

const Selected = (props) => {
  const [place, setPlace] = useState(null);

  return (
    <div className="example-stack">
      <MapSelector onChange={(location) => setPlace(location)} {...props} />
      <p>{place ? `Selected: ${place.address} (${place.lat.toFixed(4)}, ${place.lng.toFixed(4)})` : 'No place selected yet.'}</p>
    </div>
  );
};

export default {
  name: 'MapSelector',
  description: 'An address search box (with Google address suggestions) above a map. Press Search or Enter to find the address; onChange gets the place, which shows under the box with a button to remove it. The map comes from Google, so it needs a network connection; offline the search box still works but the map area stays blank.',
  examples: [
    {
      name: 'Default',
      code: '<MapSelector />',
      output: <MapSelector />
    },
    {
      name: 'Starting on an address',
      code: '<MapSelector defaultValue="1600 Amphitheatre Parkway, Mountain View, CA" />',
      output: <MapSelector defaultValue="1600 Amphitheatre Parkway, Mountain View, CA" />
    },
    {
      name: 'Custom placeholder',
      code: '<MapSelector placeholder="Search for a store or street address..." />',
      output: <MapSelector placeholder="Search for a store or street address..." />
    },
    {
      name: 'Reading the selected place',
      code: `const [place, setPlace] = useState(null);

<MapSelector onChange={(location) => setPlace(location)} />
<p>{place ? place.address : 'No place selected yet.'}</p>`,
      output: <Selected />
    }
  ]
};
