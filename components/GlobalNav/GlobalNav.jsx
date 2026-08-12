import { map } from "lodash";
import PropTypes from "prop-types";

import "./GlobalNav.scss";

const GlobalNav = ({
  activeLinkKey,
  links,
  appName,
  onLinkClick,
  homeLink,
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
              const handleOnClick = (e) => {
                e.preventDefault();
                if (onLinkClick) onLinkClick(link);
              };
              return (
                <a
                  key={link}
                  href={typeof(link) == 'string' ? link : ''}
                  className={
                    "nav-link" +
                    (activeLinkKey && key === activeLinkKey ? " active" : "")
                  }
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
  onLinkClick: PropTypes.func,
  homeLink: PropTypes.string,
};

GlobalNav.defaultProps = {
  homeLink: "/",
};

export default GlobalNav;
