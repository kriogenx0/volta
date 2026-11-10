import { useEffect, useRef } from 'react';

// Calls `onEscape` when Escape is pressed while `active`. Shared by the
// dismissible overlays (Modal, Drawer) so keyboard users can always
// close them. The latest `onEscape` is read from a ref, so an inline arrow
// function doesn't re-attach the document listener on every render.
const useEscapeKey = (onEscape, active = true) => {
  const handlerRef = useRef(onEscape);

  useEffect(() => {
    handlerRef.current = onEscape;
  }, [onEscape]);

  useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && handlerRef.current) handlerRef.current(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active]);
};

export default useEscapeKey;
