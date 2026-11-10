import PropTypes from 'prop-types';

import './NavBar.scss';
import { map } from '../../util/collection';

// The navigation bar at the top of an app: the app name on the left and a row of page links on the right.
const NavBar = ({
  activeLinkKey,
  links,
  appName,
  onLinkClick,
  homeLink = '/',
  appSubtitle
}) => {
  const handleLinkClick = (link, key, e) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link, key);
    }
  };

  return (
    <header className="volta-navbar">
      <div className="l-width">
        <div className="header-left">
          {appName ? (
            <a href={homeLink} className="app_name heading">
              {appName}
              {appSubtitle ? <small>{appSubtitle}</small> : ''}
            </a>
          ) : null}
        </div>
        {links ? (
          <nav>
            {map(links, (link, key) => {
              const isActive = Boolean(activeLinkKey) && key === activeLinkKey;
              // The links object's own keys are unique, so they make the React
              // key; the link values (often objects) can't.
              return (
                <a
                  key={key}
                  href={typeof link === 'string' ? link : ''}
                  className={'nav-link' + (isActive ? ' active' : '')}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={handleLinkClick.bind(null, link, key)}
                >
                  {key}
                </a>
              );
            })}
          </nav>
        ) : (
          links
        )}
      </div>
    </header>
  );
};

NavBar.propTypes = {
  // { title: url }
  links: PropTypes.object,
  // The key of the current page
  activeLinkKey: PropTypes.any,
  // The app name, a link to homeLink
  appName: PropTypes.string,
  // Small text after the app name
  appSubtitle: PropTypes.string,
  // Called with (link, key); the browser then does not follow the href
  onLinkClick: PropTypes.func,
  // Where the app name goes
  homeLink: PropTypes.string
};

// GlobalNav is another name for NavBar, kept for existing callers.
const GlobalNav = NavBar;

export { NavBar, GlobalNav };
export default NavBar;
