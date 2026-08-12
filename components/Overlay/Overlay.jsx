import { useEffect } from 'react';

import './Overlay.scss';

const Overlay = ({ showing = null, onClick, children }) => {
  useEffect(() => {
    if (!showing) return undefined;

    const el = document.createElement('div');
    el.className = `${Overlay.defaultClassName} showing`;
    document.body.appendChild(el);

    if (onClick) el.addEventListener('click', onClick);

    return () => {
      if (onClick) el.removeEventListener('click', onClick);
      document.body.removeChild(el);
    };
  }, [showing, onClick]);

  return null;
};

Overlay.defaultClassName = 'volta-overlay';

export default Overlay;
