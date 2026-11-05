import { map } from "lodash";
import PropTypes from "prop-types";

import "./GlobalNav.scss";

const GlobalNav = ({
  activeLinkKey,
  links,
  appName,
  onLinkClick,
  homeLink = "/",
  appSubtitle,
}) => {

  const handleLinkClick = (link, key, e) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link, key);
    }
  };

  return (
    <header className="volta-global_nav">
      <div className="l-width">
        <div className="header-left">
          {appName ? (
            <a href={homeLink} className="app_name heading">
              {appName}
              {appSubtitle ? <small>{appSubtitle}</small> : ""}
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
                  href={typeof(link) == 'string' ? link : ''}
                  className={"nav-link" + (isActive ? " active" : "")}
                  aria-current={isActive ? "page" : undefined}
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

GlobalNav.propTypes = {
  activeLinkKey: PropTypes.any,
  links: PropTypes.object, // { title: url }
  appName: PropTypes.string,
  appSubtitle: PropTypes.string,
  onLinkClick: PropTypes.func,
  homeLink: PropTypes.string,
};

export default GlobalNav;
