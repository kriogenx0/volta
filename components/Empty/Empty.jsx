import React from 'react';

import './Empty.scss';

const Empty = (props) => (
  <div className='soda-empty'>
    {props.children}
  </div>
);

export default Empty;
