// Creates a new "layer" on the page (e.g. a modal or overlay), rendered
// into its own DOM node appended to <body> via a portal. Appending to the
// body is easier than managing the z-index of everything on the page --
// it's also better for accessibility and makes stacking a snap (since
// layers stack in mount order).
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Layer = ({ children }) => {
  const layerEl = useRef(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const el = document.createElement('div');
    el.className = 'volta-layer';
    document.body.appendChild(el);
    layerEl.current = el;
    forceUpdate((n) => n + 1);

    return () => {
      document.body.removeChild(el);
      layerEl.current = null;
    };
  }, []);

  if (!layerEl.current || !children) return null;

  return createPortal(children, layerEl.current);
};

export default Layer;
