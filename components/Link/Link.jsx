import PropTypes from 'prop-types';

// Text to match as it is, not as a pattern
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const Link = ({ to, params, className, children, ...rest }) => {
  const buildHref = () => {
    let href = to;

    if (params) {
      for (let param in params) {
        // A replacer function keeps `$&` and friends in a value literal
        href = href.replace(new RegExp(`:${escapeRegExp(param)}\\b`, 'ig'), () => params[param]);
      }
    }
    return href;
  };

  return (
    <a href={buildHref()} {...rest} className={['volta-link', className].filter(Boolean).join(' ')}>
      {children}
    </a>
  );
};

Link.propTypes = {
  to: PropTypes.string.isRequired, // a path; `:name` segments are filled from params
  params: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node
};

export default Link;
