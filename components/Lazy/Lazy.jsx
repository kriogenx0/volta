import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Lazy.scss';

// Holds back its children until it is near the screen. Until then it shows the
// placeholder (or just keeps its place with `minHeight`), so a long page with many
// heavy parts only renders the ones being looked at. Once the children have shown
// they stay. Without IntersectionObserver the children render straight away.
const Lazy = ({
  children,
  placeholder = null,
  minHeight,
  rootMargin = '400px',
  load = false,
  onLoad,
  as: Tag = 'div',
  className = '',
  ...rest
}) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined');
  const shown = load || seen;

  useEffect(() => {
    if (shown) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) setSeen(true);
    }, { rootMargin });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [shown, rootMargin]);

  useEffect(() => {
    if (shown && onLoad) onLoad();
  }, [shown]);

  return (
    // The reserved height is a runtime value, so it has to be inline
    <Tag
      {...rest}
      ref={ref}
      className={`volta-lazy${className ? ` ${className}` : ''}`}
      aria-busy={shown ? undefined : true}
      style={shown || minHeight === undefined ? undefined : { minHeight }}
    >
      {shown ? children : placeholder}
    </Tag>
  );
};

Lazy.propTypes = {
  children: PropTypes.node,
  // Shown in place of the children until they load (a Loader, a skeleton)
  placeholder: PropTypes.node,
  // Space to keep until the children load, so the page doesn't jump: a number of pixels or a CSS length
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // How far outside the screen counts as near, as a CSS margin
  rootMargin: PropTypes.string,
  // Load now, whether or not it is near the screen
  load: PropTypes.bool,
  // Called once, when the children have shown
  onLoad: PropTypes.func,
  // The element to render: 'div' by default
  as: PropTypes.elementType,
  className: PropTypes.string
};

export { Lazy };
export default Lazy;
