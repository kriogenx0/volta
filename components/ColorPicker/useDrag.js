// Calls onDrag with the mouse event on mouse down and on every mouse move
// until the button is released, listening on the document so the drag keeps
// working outside the element. Left button only.

import { useEffect, useRef } from 'react';

const noop = () => {};

export default function useDrag(onDrag) {
  const handler = useRef(onDrag);
  handler.current = onDrag;

  const stop = useRef(noop);
  const dragging = useRef(false);

  useEffect(() => () => stop.current(), []);

  const onMouseDown = (event) => {
    if (event.button !== 0) return;
    stop.current();

    const move = (e) => handler.current(e);
    const up = () => stop.current();
    stop.current = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
      dragging.current = false;
      stop.current = noop;
    };

    dragging.current = true;
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    handler.current(event);
  };

  return { onMouseDown, dragging };
}
