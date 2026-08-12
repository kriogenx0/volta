import GlobalNav from '../../components/GlobalNav/GlobalNav';

const pages = {
  Home: {},
  Dashboard: {},
  Reports: {},
  Settings: {},
};

export default {
  name: 'GlobalNav',
  description: 'The top navigation bar with app name, links, and optional subtitle.',
  examples: [
    {
      name: 'GlobalNav',
      code: `<GlobalNav
  appName="My App"
  links={{ Home: {}, Dashboard: {}, Reports: {} }}
  activeLinkKey="Home"
  onLinkClick={(link, key) => console.log(key)}
/>`,
      output: (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
          <GlobalNav
            appName="My App"
            links={pages}
            activeLinkKey="Home"
            onLinkClick={() => {}}
          />
        </div>
      )
    },
    {
      name: 'With subtitle',
      code: `<GlobalNav appName="My App" appSubtitle="Beta" links={pages} />`,
      output: (
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
          <GlobalNav
            appName="My App"
            appSubtitle="Beta"
            links={pages}
            activeLinkKey="Dashboard"
            onLinkClick={() => {}}
          />
        </div>
      )
    },
  ]
};
