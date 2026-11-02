import { useState } from 'react';

import Button from '../../components/Button/Button';
import SearchSelector from '../../components/SearchSelector/SearchSelector';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango'];
const search = (query) => FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()));

const SearchSelectorExample = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Choose fruit</Button>
      <p>Selected: {selected.join(', ') || 'none'}</p>
      <SearchSelector open={open} onType={search} onChange={setSelected} onClose={() => setOpen(false)} />
    </div>
  );
};

export default {
  name: 'SearchSelector',
  description: 'A popover with a search box. Type to search, click a result to select it; click outside to close.',
  examples: [
    {
      name: 'SearchSelector',
      code: `const [open, setOpen] = useState(false);
const [selected, setSelected] = useState([]);

<Button onClick={() => setOpen(true)}>Choose fruit</Button>
<SearchSelector
  open={open}
  onType={(query) => FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))}
  onChange={setSelected}
  onClose={() => setOpen(false)}
/>`,
      output: <SearchSelectorExample />
    }
  ]
};
