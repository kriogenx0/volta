import { useEffect } from 'react';
import PropTypes from 'prop-types';

import useScrollLock from './useScrollLock';

import './Overlay.scss';

// A dimming layer over the whole window, appended to <body> while `showing`.
// It draws only the dim layer: it renders nothing in place, so children are not
// shown (put dialogs and menus above it in their own positioned element). The
// page behind it doesn't scroll while it shows.
const Overlay = ({ showing = null, onClick }) => {
  useScrollLock(Boolean(showing));

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

Overlay.propTypes = {
  showing: PropTypes.bool,
  // Called when the dimmed area is clicked
  onClick: PropTypes.func
};

Overlay.defaultClassName = 'volta-overlay';

export default Overlay;
