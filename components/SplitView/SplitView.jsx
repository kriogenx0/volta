import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import "./SplitView.scss";

// How far the arrow keys move the divider
const KEY_STEP = 16;
const PAGE_STEP = 64;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// A main pane beside a collapsible side pane. `open` reveals the side pane, and a
// divider between them can be dragged (or moved with the arrow keys) to resize it.
// With `setScrollHeight` (the default) the view is sized to fill the window
// below its own top edge, so the two panes scroll independently of the page.
const SplitView = ({
  side, open = false, children, setScrollHeight = true,
  resizable = true, sideWidth, defaultSideWidth, minSideWidth = 160, maxSideWidth = 640, onResize
}) => {

  const [height, setHeight] = useState(null);
  // The side pane's width in px once it has been sized; null is "as wide as its content"
  const [internalWidth, setInternalWidth] = useState(defaultSideWidth ?? null);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef(null);
  const sideRef = useRef(null);
  const drag = useRef(null); // { startX, startWidth } while a drag is going on

  const width = sideWidth !== undefined ? sideWidth : internalWidth;

  // The most the side pane may take: its own limit, and always leaving room for the main pane
  const limit = () => {
    const room = containerRef.current ? containerRef.current.offsetWidth - minSideWidth : Infinity;
    return Math.max(minSideWidth, Math.min(maxSideWidth, room));
  };

  const resizeTo = (next) => {
    const value = Math.round(clamp(next, minSideWidth, limit()));
    if (value === width) return;
    if (sideWidth === undefined) setInternalWidth(value);
    if (onResize) onResize(value);
  };

  const currentWidth = () => (width !== null && width !== undefined ? width : (sideRef.current ? sideRef.current.offsetWidth : minSideWidth));

  // Dragging the divider: the side pane is on the right, so moving left makes it wider
  const startDrag = (event) => {
    if (event.type === 'mousedown' && event.button !== 0) return;
    const point = event.touches ? event.touches[0] : event;
    if (event.cancelable) event.preventDefault(); // no text selection while dragging
    drag.current = { startX: point.clientX, startWidth: currentWidth() };
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return undefined;

    const move = (event) => {
      const point = event.touches ? event.touches[0] : event;
      resizeTo(drag.current.startWidth + (drag.current.startX - point.clientX));
    };
    const stop = () => setDragging(false);

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
    document.addEventListener('touchmove', move);
    document.addEventListener('touchend', stop);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', stop);
      document.removeEventListener('touchmove', move);
      document.removeEventListener('touchend', stop);
    };
  }, [dragging, width, sideWidth, minSideWidth, maxSideWidth]);

  const handleKeyDown = (event) => {
    // Left makes the side pane wider (the divider moves left), right makes it narrower
    const keys = {
      ArrowLeft: currentWidth() + KEY_STEP,
      ArrowRight: currentWidth() - KEY_STEP,
      PageUp: currentWidth() + PAGE_STEP,
      PageDown: currentWidth() - PAGE_STEP,
      Home: minSideWidth,
      End: limit()
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    resizeTo(keys[event.key]);
  };

  // Init
  useEffect(() => {
    if (!setScrollHeight) return undefined;

    let lastOffset;

    const adjustHeight = () => {
      if (!containerRef.current) return;

      // Get offset
      const top = containerRef.current.offsetTop;
      if (lastOffset != top) {
        lastOffset = top;
        setHeight(top ? `calc(100vh - ${top}px)` : null);
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => {
      window.removeEventListener('resize', adjustHeight);
    };
  }, [setScrollHeight]);

  return (
    <div
      className={'volta-split_view' + (open ? ' split_view-open' : '') + (dragging ? ' split_view-dragging' : '')}
      ref={containerRef}
      style={{ height }}
    >
      <div className='split_view-main'>
        {children}
      </div>
      {resizable && open && (
        // The divider. Its position and value are the side pane's width, so a screen reader can say it.
        <div
          className='split_view-handle'
          role='separator'
          aria-orientation='vertical'
          aria-label='Resize side pane'
          aria-valuemin={minSideWidth}
          aria-valuemax={maxSideWidth}
          aria-valuenow={width !== null && width !== undefined ? width : undefined}
          tabIndex={0}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          onKeyDown={handleKeyDown}
        />
      )}
      <div
        className='split_view-side'
        ref={sideRef}
        // A width the user has chosen, or that the caller set; closed, the pane has none
        style={open && width !== null && width !== undefined ? { width, flex: 'none' } : undefined}
      >
        {side}
      </div>
    </div>
  );

};

SplitView.propTypes = {
  // Content of the side pane
  side: PropTypes.node,
  open: PropTypes.bool,
  // Fit the view to the window below its top edge
  setScrollHeight: PropTypes.bool,
  // Show a divider that can be dragged, or moved with the arrow keys, to resize the side pane
  resizable: PropTypes.bool,
  // The side pane's width in px, when the caller holds it (controlled)
  sideWidth: PropTypes.number,
  // The side pane's starting width in px when the view holds it; without either it is as wide as its content
  defaultSideWidth: PropTypes.number,
  minSideWidth: PropTypes.number,
  maxSideWidth: PropTypes.number,
  // Called with the new width in px as the pane is resized
  onResize: PropTypes.func,
  // Content of the main pane
  children: PropTypes.node
};

export default SplitView;
