import { useState } from 'react';

import Button from '../../components/Button/Button';
import SearchSelector from '../../components/SearchSelector/SearchSelector';

const FRUITS = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Lemon', 'Mango'];
const COUNTRIES = ['Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Egypt', 'France', 'Germany', 'India'];

const matching = (list) => (query) => list.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
const matchAfterTwoLetters = (query) => (query.length < 2 ? [] : matching(COUNTRIES)(query));

// Opens the selector from a button and shows what was picked
const Chooser = ({ buttonLabel, ...props }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  return (
    <div className="example-stack">
      <Button onClick={() => setOpen(true)}>{buttonLabel}</Button>
      <p>Selected: {selected.join(', ') || 'none'}</p>
      <SearchSelector open={open} onChange={setSelected} onClose={() => setOpen(false)} {...props} />
    </div>
  );
};

export default {
  name: 'SearchSelector',
  description: 'A popover with a search box. Type to search with onType, click a result to select it, and click outside to close. Selections are reported through onChange.',
  examples: [
    {
      name: 'Pick several items',
      code: `const [open, setOpen] = useState(false);
const [selected, setSelected] = useState([]);

<Button onClick={() => setOpen(true)}>Choose fruit</Button>
<SearchSelector
  open={open}
  onType={(query) => FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()))}
  onChange={setSelected}
  onClose={() => setOpen(false)}
/>`,
      output: <Chooser buttonLabel="Choose fruit" onType={matching(FRUITS)} />
    },
    {
      name: 'Pick one item',
      code: `<SearchSelector
  open={open}
  multipleItems={false}
  onType={searchFruit}
  onChange={setSelected}
  onClose={() => setOpen(false)}
/>`,
      output: <Chooser buttonLabel="Choose one fruit" multipleItems={false} onType={matching(FRUITS)} />
    },
    {
      name: 'Allow the same item twice',
      code: `<SearchSelector
  open={open}
  uniqueItems={false}
  onType={searchFruit}
  onChange={setSelected}
  onClose={() => setOpen(false)}
/>`,
      output: <Chooser buttonLabel="Add fruit" uniqueItems={false} onType={matching(FRUITS)} />
    },
    {
      name: 'Search starts after two letters',
      code: `<SearchSelector
  open={open}
  onType={(query) => (query.length < 2 ? [] : countries.filter((c) => c.toLowerCase().includes(query.toLowerCase())))}
  onChange={setSelected}
  onClose={() => setOpen(false)}
/>`,
      output: <Chooser buttonLabel="Choose countries" onType={matchAfterTwoLetters} />
    }
  ]
};
