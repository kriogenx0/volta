const Link = ({ to, params, className, children, ...rest }) => {
  const buildHref = () => {
    let href = to;

    if (params) {
      for (let param in params) {
        href = href.replace(new RegExp(`:${param}\\b`, 'ig'), params[param]);
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

export default Link;
