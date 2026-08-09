import { useState, useEffect, useRef } from 'react';

import "./SplitView.scss";

const SplitView = ({ side, open, children, setScrollHeight }) => {

  const [height, setHeight] = useState(null);

  const containerRef = useRef(null);
  
  // Init
  useEffect(() => {
    if (setScrollHeight) {
      adjustHeight();
      window.addEventListener('resize', adjustHeight);
      return () => {
        window.removeEventListener('resize', adjustHeight);
      };
    }
  }, []);

  let lastOffset;

  const adjustHeight = () => {
    if (!containerRef || !containerRef.current) return console.warn('ref not found', containerRef);

    // Get offset
    const top = containerRef.current.offsetTop;
    if (lastOffset != top) {
      lastOffset = top;
      const newHeight = top ? `calc(100vh - ${top}px)` : null;
      // console.log('newHeight', top, newHeight);
      setHeight(top ? newHeight : null);
    }
  };

  // calc(100vh - 47px)
  //  style={{ display: "flex", flexDirection: "row" }}

  return (
    <div className={'c-split_view' + (open ? ' split_view-open' : '')} ref={containerRef} style={{ height }}>
      <div className='split_view-main'>
        {children}
      </div>
      <div className='split_view-side'>
        {side}
      </div>
    </div>
  );

};

SplitView.defaultProps = {
  setScrollHeight: true
};


export default SplitView;