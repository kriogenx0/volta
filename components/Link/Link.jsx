import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

import './Link.scss';

// Text to match as it is, not as a pattern
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// `to` with its `:name` segments filled from `params`
const fillParams = (to, params) => {
  let href = to;
  if (params) {
    for (let param in params) {
      // A replacer function keeps `$&` and friends in a value literal
      href = href.replace(new RegExp(`:${escapeRegExp(param)}\\b`, 'ig'), () => params[param]);
    }
  }
  return href;
};

// A link to another page. By default a plain <a href>, so pressing it loads the page.
// With `router` it is React Router's Link instead, so it navigates on the client (it
// has to be inside a router). `variant="action"` is the quiet look for a header or
// toolbar. ActionLink is that variant with the router on.
const Link = ({ to, params, variant = 'link', router = false, className, children, ...rest }) => {
  const classes = ['volta-link', variant !== 'link' && `volta-link--${variant}`, className].filter(Boolean).join(' ');

  if (router) {
    return (
      <RouterLink to={typeof to === 'string' ? fillParams(to, params) : to} {...rest} className={classes}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={fillParams(to, params)} {...rest} className={classes}>
      {children}
    </a>
  );
};

Link.variants = ['link', 'action'];

Link.propTypes = {
  // A path or URL; `:name` segments are filled from params. With `router` it can also be a location object.
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  params: PropTypes.object,
  // 'link' is the page's own link style; 'action' is a quiet text link
  variant: PropTypes.oneOf(Link.variants),
  // Navigate with React Router instead of loading the page
  router: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node
};

// ActionLink is another name for the quiet, routed link.
const ActionLink = (props) => <Link variant="action" router {...props} />;

export { Link, ActionLink };
export default Link;
