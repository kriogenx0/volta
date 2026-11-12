import { useState } from 'react';

import { SideBarList } from '../../../components';

import Dashboard from './Dashboard';
import Login from './Login';
import Orders from './Orders';
import People from './People';
import Settings from './Settings';
import Signup from './Signup';

import './Examples.scss';

// The example pages: whole screens built from Volta components, to see how they fit together.
// `key` is what the sidebar and the other pages use to name one.
export const EXAMPLES = [
  { key: 'login', label: 'Login', description: 'A sign-in form.', Page: Login, framed: true },
  { key: 'signup', label: 'Signup', description: 'A sign-up form with a terms checkbox.', Page: Signup, framed: true },
  { key: 'dashboard', label: 'Dashboard', description: 'Headline numbers, goals and recent activity.', Page: Dashboard },
  { key: 'list', label: 'List', description: 'A searchable list of people with an empty state.', Page: People },
  { key: 'table', label: 'Table', description: 'A table of orders filtered by tabs.', Page: Orders },
  { key: 'settings', label: 'Settings', description: 'Tabs with a form, switches and a confirmed delete.', Page: Settings }
];

const SIDEBAR = [{ label: 'Pages', items: EXAMPLES.map(({ key, label }) => ({ value: key, label })) }];

const Examples = () => {
  const [selected, setSelected] = useState(EXAMPLES[0].key);
  const example = EXAMPLES.find(({ key }) => key === selected) || EXAMPLES[0];
  const { Page } = example;

  return (
    <div className="view-examples">
      <SideBarList className="examples-list" ariaLabel="Example pages" groups={SIDEBAR} value={selected} onSelect={setSelected} />
      <section className="examples-detail" aria-labelledby="examples-title">
        <header className="examples-header">
          <h2 id="examples-title">{example.label}</h2>
          <p>{example.description}</p>
        </header>
        <div className={`examples-frame${example.framed ? ' examples-frame--centered' : ''}`}>
          <Page onOpen={setSelected} />
        </div>
      </section>
    </div>
  );
};

export default Examples;
