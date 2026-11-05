import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import "./SplitView.scss";

// A main pane beside a collapsible side pane. `open` reveals the side pane.
// With `setScrollHeight` (the default) the view is sized to fill the window
// below its own top edge, so the two panes scroll independently of the page.
const SplitView = ({ side, open = false, children, setScrollHeight = true }) => {

  const [height, setHeight] = useState(null);

  const containerRef = useRef(null);

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
    <div className={'volta-split_view' + (open ? ' split_view-open' : '')} ref={containerRef} style={{ height }}>
      <div className='split_view-main'>
        {children}
      </div>
      <div className='split_view-side'>
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
  // Content of the main pane
  children: PropTypes.node
};

export default SplitView;
