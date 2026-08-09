import { map } from 'lodash';

import "./ListDefinitions.scss";

const ListDefinitions = ({ data }) => {
  return (
    <dl className='c-list_definitions'>
      {map(data, (value, key) => (
        <React.Fragment key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
};

export default ListDefinitions;