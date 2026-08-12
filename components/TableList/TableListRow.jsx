// A single row in <TableList>.
//
// NOT wired into this library's index.js: `record` is expected to be a
// Backbone-style model (.get('id')), and it references Checkbox/PVR/
// IconButton variants ('./inputs/checkbox', './pvr', './icon-button')
// that don't exist in this repo. Kept for reference/future rewrite.
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip/Tooltip';

const TableListRow = ({ showCheckbox, fields, record, isChecked, itemActions, isDraggable, dragDisabled, onCheckboxChange }) => {
  const handleCheckChange = (checked) => {
    onCheckboxChange(checked, record.get('id'));
  };

  return (
    <tr data-id={record.get('id')} data-relation-id={record.getItemRelation && record.getItemRelation()?.id}>
      {showCheckbox && (
        <td width="1">
          <Checkbox flush className="l-v-align-middle" checked={isChecked} onChange={handleCheckChange} />
        </td>
      )}

      {fields.map((field, index) => {
        const displayValue = typeof field.getValue === 'function'
          ? field.getValue.call(record, record)
          : record[field.name];

        return (
          <td className="title-column" key={index}>
            <div>
              {field.linkTo
                ? (
                  <Link
                    to={typeof field.linkParams === 'function' ? field.linkParams.call(record, record) : field.linkTo}
                    className="gray-link strong"
                  >
                    {displayValue}
                  </Link>
                )
                : typeof field.link === 'function'
                  ? <a href={field.link.call(record, record)}>{displayValue}</a>
                  : <span>{displayValue}</span>}
            </div>
          </td>
        );
      })}

      {itemActions && (
        <td width="1">
          <ul className="lst">
            {itemActions.map((item, index) => (
              <li className="lst_row" key={index}>
                <a href="javascript: void(0)" onClick={() => item.action(record)}>{item.label}</a>
              </li>
            ))}
          </ul>
        </td>
      )}

      {isDraggable && (
        <td width="1" style={{ opacity: dragDisabled ? 0.35 : 1 }}>
          <Tooltip
            gravity="right"
            title={dragDisabled ? 'Manual reordering not available while a sort or filter is applied.' : ' '}
          >
            <i className={`icn icn-gear bti-rearrange ${dragDisabled ? 'cursor-disabled' : ''}`} />
          </Tooltip>
        </td>
      )}
    </tr>
  );
};

TableListRow.propTypes = {
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool,
  showCheckbox: PropTypes.bool,
  fields: PropTypes.array,
  record: PropTypes.object,
  itemActions: PropTypes.array,
  isDraggable: PropTypes.bool,
  dragDisabled: PropTypes.bool
};

TableListRow.defaultProps = {
  showCheckbox: true,
  fields: null,
  record: null,
  isChecked: false,
  itemActions: null,
  onCheckboxChange: () => {}
};

export default TableListRow;
