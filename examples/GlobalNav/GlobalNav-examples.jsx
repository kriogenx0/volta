import { useState } from 'react';

import GlobalNav from '../../components/GlobalNav/GlobalNav';

const pages = {
  Home: '/',
  Dashboard: '/dashboard',
  Reports: '/reports',
  Settings: '/settings',
};

// Keeps the chosen page in state; onLinkClick stops the browser following the href
const Interactive = () => {
  const [page, setPage] = useState('Dashboard');
  return (
    <div className="example-stack">
      <GlobalNav
        appName="My App"
        links={pages}
        activeLinkKey={page}
        onLinkClick={(link, key) => setPage(key)}
      />
      <p>Current page: {page}</p>
    </div>
  );
};

export default {
  name: 'GlobalNav',
  description: 'The top navigation bar with the app name, a row of links and an optional subtitle. The links object maps each title to a url; pass onLinkClick to handle clicks yourself (the browser then does not follow the url) and activeLinkKey to mark the current page.',
  examples: [
    {
      name: 'App name and links',
      code: `<GlobalNav
  appName="My App"
  links={{ Home: '/', Dashboard: '/dashboard', Reports: '/reports', Settings: '/settings' }}
  activeLinkKey="Home"
  onLinkClick={(link, key) => console.log(key)}
/>`,
      output: (
        <GlobalNav
          appName="My App"
          links={pages}
          activeLinkKey="Home"
          onLinkClick={() => {}}
        />
      )
    },
    {
      name: 'With subtitle',
      code: `<GlobalNav
  appName="My App"
  appSubtitle="Beta"
  links={{ Home: '/', Dashboard: '/dashboard', Reports: '/reports', Settings: '/settings' }}
  activeLinkKey="Dashboard"
  onLinkClick={(link, key) => console.log(key)}
/>`,
      output: (
        <GlobalNav
          appName="My App"
          appSubtitle="Beta"
          links={pages}
          activeLinkKey="Dashboard"
          onLinkClick={() => {}}
        />
      )
    },
    {
      name: 'Controlled active link',
      code: `const [page, setPage] = useState('Dashboard');

<GlobalNav
  appName="My App"
  links={pages}
  activeLinkKey={page}
  onLinkClick={(link, key) => setPage(key)}
/>`,
      output: <Interactive />
    },
    {
      name: 'Name only, no links',
      code: '<GlobalNav appName="My App" homeLink="/start" />',
      output: <GlobalNav appName="My App" homeLink="/start" />
    },
  ]
};
