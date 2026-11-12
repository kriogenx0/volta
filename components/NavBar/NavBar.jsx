import { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import './NavBar.scss';
import { map } from '../../util/collection';

// The navigation bar at the top of an app: the app name on the left and a row of page links on the right.
// On a narrow screen (640px and below) the links fold behind a menu button that opens them as a list
// under the bar; that is done by the stylesheet, so nothing here reads the window. `collapse={false}`
// keeps the row at every width.
const NavBar = ({
  activeLinkKey,
  links,
  appName,
  onLinkClick,
  homeLink = '/',
  appSubtitle,
  collapse = true
}) => {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Escape closes the open menu
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleLinkClick = (link, key, e) => {
    setOpen(false);
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link, key);
    }
  };

  return (
    <header className={`volta-navbar${collapse ? ' volta-navbar--collapse' : ''}${open ? ' volta-navbar--open' : ''}`}>
      <div className="l-width">
        <div className="header-left">
          {appName ? (
            <a href={homeLink} className="app_name heading">
              {appName}
              {appSubtitle ? <small>{appSubtitle}</small> : ''}
            </a>
          ) : null}
        </div>
        {links && collapse && (
          <button
            type="button"
            className="navbar-menu_button"
            aria-label={open ? 'Close menu' : 'Menu'}
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((current) => !current)}
          >
            <Icon type={open ? 'xmark' : 'line.3.horizontal'} aria-hidden="true" />
          </button>
        )}
        {links ? (
          <nav id={menuId} aria-label="Main">
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
  homeLink: PropTypes.string,
  // Fold the links behind a menu button on a narrow screen (on by default)
  collapse: PropTypes.bool
};

// GlobalNav is another name for NavBar, kept for existing callers.
const GlobalNav = NavBar;

export { NavBar, GlobalNav };
export default NavBar;
