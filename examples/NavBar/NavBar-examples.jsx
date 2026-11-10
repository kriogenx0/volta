import { useState } from 'react';

import NavBar from '../../components/NavBar/NavBar';

const topBarLinks = {
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
      <NavBar
        appName="My App"
        links={topBarLinks}
        activeLinkKey={page}
        onLinkClick={(link, key) => setPage(key)}
      />
      <p>Current page: {page}</p>
    </div>
  );
};

export default {
  name: 'NavBar',
  description: 'The navigation bar at the top of an app: the app name, a row of links and an optional subtitle. The links object maps each title to a url; pass onLinkClick to handle clicks yourself (the browser then does not follow the url) and activeLinkKey to mark the current page. GlobalNav is another name for it.',
  examples: [
{
      name: 'App name and links',
      code: `<NavBar
  appName="My App"
  links={{ Home: '/', Dashboard: '/dashboard', Reports: '/reports', Settings: '/settings' }}
  activeLinkKey="Home"
  onLinkClick={(link, key) => console.log(key)}
/>`,
      output: (
        <NavBar
          appName="My App"
          links={topBarLinks}
          activeLinkKey="Home"
          onLinkClick={() => {}}
        />
      )
    },
    {
      name: 'With a subtitle',
      code: `<NavBar
  appName="My App"
  appSubtitle="Beta"
  links={{ Home: '/', Dashboard: '/dashboard', Reports: '/reports', Settings: '/settings' }}
  activeLinkKey="Dashboard"
  onLinkClick={(link, key) => console.log(key)}
/>`,
      output: (
        <NavBar
          appName="My App"
          appSubtitle="Beta"
          links={topBarLinks}
          activeLinkKey="Dashboard"
          onLinkClick={() => {}}
        />
      )
    },
    {
      name: 'Controlled active link',
      code: `const [page, setPage] = useState('Dashboard');

<NavBar
  appName="My App"
  links={topBarLinks}
  activeLinkKey={page}
  onLinkClick={(link, key) => setPage(key)}
/>`,
      output: <Interactive />
    },
    {
      name: 'Name only, no links',
      code: '<NavBar appName="My App" homeLink="/start" />',
      output: <NavBar appName="My App" homeLink="/start" />
    }
  ]
};
