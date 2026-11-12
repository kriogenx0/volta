import React from 'react';
import { map } from '../../util/collection';

import "./Definitions.scss";

const Definitions = ({ data }) => {
  return (
    <dl className='volta-definitions'>
      {map(data, (value, key) => (
        <React.Fragment key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
};

// ListDefinitions is the old name, kept for existing callers
const ListDefinitions = Definitions;

export { Definitions, ListDefinitions };
export default Definitions;