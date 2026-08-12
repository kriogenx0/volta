// A table view for showing tabular Backbone-collection data, with
// optional drag-to-reorder (via jquery-ui's sortable) and infinite scroll.
//
// NOT wired into this library's index.js: `data` is expected to be a
// Backbone-style collection (.models, .at(), .hasNextPage()), and
// drag-to-reorder depends on jquery-ui's sortable plugin, neither of
// which are dependencies here (jQuery was removed from this repo
// entirely -- see README "Known gaps"). Kept for reference/future
// rewrite against a real data layer and a modern drag-and-drop library.
import { useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';

import Checkbox from '../Checkbox';
import Empty from '../Empty';
import TableListRow from './TableListRow';

const TableList = ({
  fields, data, showCheckbox, showActions, emptyMessage, isDraggable, dragDisabled,
  itemActions, onSelectChange, onMasterCheckboxChange, selectedItems, masterSelected,
  updateRank, actions, children
}) => {
  const sortRef = useRef(null);
  const draggedRef = useRef(null);
  const originalIndexRef = useRef(null);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState(true);

  const handleSort = (key) => {
    const newSortOrder = !sortOrder;
    setSortOrder(newSortOrder);
    setSortField(key);
    actions.objectListSort({ field: key, order: newSortOrder ? 'asc' : 'desc' });
  };

  const handleLoadMore = () => {
    actions.objectListLoadMore();
  };

  const destroySortable = useCallback(() => {
    if ($(sortRef.current).sortable('instance')) {
      $(sortRef.current).sortable('destroy');
    }
  }, []);

  const refreshManualReorder = useCallback(() => {
    if (!isDraggable || dragDisabled) {
      destroySortable();
      return;
    }

    $(sortRef.current).sortable({
      items: '> tr',
      handle: '.bti-rearrange',
      placeholder: 'srt_placeholder',
      opacity: 0.9,
      forceHelperSize: false,
      cursorAt: { right: 0, bottom: 0 },
      helper(event, ui) {
        const title = $(ui).find('.title-column a').html();
        return $(`<div><span class="srt_helper_title">${title}</span></div>`).addClass('srt_helper');
      },
      start(event, ui) {
        document.body.classList.add('force-hide-tooltips');
        originalIndexRef.current = $(ui.item).index();
        draggedRef.current = $(ui.item);
      },
      stop(event, ui) {
        document.body.classList.remove('force-hide-tooltips');
        event.preventDefault();

        const newIndex = draggedRef.current.index();
        if (newIndex === originalIndexRef.current) return;

        let newRank;
        if (newIndex === 0) {
          newRank = data.at(newIndex).getRank() - 1;
        } else if (newIndex === data.length - 1) {
          newRank = data.at(data.length - 1).getRank() + 1;
        } else if (originalIndexRef.current > newIndex) {
          newRank = (data.at(newIndex - 1).getRank() + data.at(newIndex).getRank()) / 2;
        } else {
          newRank = (data.at(newIndex + 1).getRank() + data.at(newIndex).getRank()) / 2;
        }

        const draggedId = ui.item[0].dataset.id;
        updateRank(draggedId, newRank);

        setTimeout(() => $(sortRef.current).sortable('cancel'), 0);
      }
    });
  }, [isDraggable, dragDisabled, data, updateRank, destroySortable]);

  useEffect(() => {
    refreshManualReorder();
    return destroySortable;
  }, [refreshManualReorder, destroySortable]);

  const orderClass = sortOrder ? 'is-sort-ascending' : 'is-sort-descending';

  return (
    <div className="volta-table_list">
      <table className="lta">
        <thead>
          <tr>
            {showCheckbox && (
              <td width="1">
                <Checkbox flush className="l-v-align-middle" onChange={onMasterCheckboxChange} checked={masterSelected} />
              </td>
            )}
            {fields && fields.map((field, index) => (
              <td key={index}>
                {field.sortable
                  ? (
                    <h5
                      className={`lta_header lta_header-sortable ${field.name && field.name === sortField ? orderClass : ''}`}
                      onClick={() => handleSort(field.name)}
                    >
                      {field.label}
                    </h5>
                  )
                  : <h5 className="lta_header">{field.label}</h5>}
              </td>
            ))}
            {showActions && <td></td>}
            {isDraggable && <td></td>}
          </tr>
        </thead>
        <tbody ref={sortRef} className="srt srt-table">
          {data && (children
            ? data.models.map((item, index) => (
              // Uses children as a row template, matching each data item.
              typeof children.type === 'function'
                ? children.type({
                  key: index,
                  fields,
                  record: item,
                  isChecked: selectedItems?.[item.get('id')],
                  onCheckboxChange: onSelectChange,
                  itemActions,
                  isDraggable,
                  dragDisabled
                })
                : null
            ))
            : data.models.map((item, index) => (
              <TableListRow
                key={index}
                fields={fields}
                record={item}
                showCheckbox={showCheckbox}
                isChecked={selectedItems?.[item.get('id')]}
                onCheckboxChange={onSelectChange}
                itemActions={itemActions}
                isDraggable={isDraggable}
                dragDisabled={dragDisabled}
              />
            )))}
        </tbody>
      </table>
      {data && data.hasNextPage() && (
        <a onClick={handleLoadMore} className="btn btn-default">Load More</a>
      )}
      {!data && <Empty>{emptyMessage}</Empty>}
    </div>
  );
};

TableList.propTypes = {
  fields: PropTypes.array,
  data: PropTypes.object,
  showCheckbox: PropTypes.bool,
  showActions: PropTypes.bool,
  emptyMessage: PropTypes.string,
  isDraggable: PropTypes.bool,
  dragDisabled: PropTypes.bool,
  itemActions: PropTypes.array,
  onSelectChange: PropTypes.func,
  onMasterCheckboxChange: PropTypes.func,
  selectedItems: PropTypes.object,
  masterSelected: PropTypes.bool,
  updateRank: PropTypes.func,
  actions: PropTypes.object
};

TableList.defaultProps = {
  fields: null,
  data: null,
  showCheckbox: true,
  showActions: true,
  emptyMessage: 'No Data Available',
  isDraggable: false,
  itemActions: null,
  onSelectChange: () => {},
  onMasterCheckboxChange: () => {},
  selectedItems: {},
  masterSelected: false
};

export default TableList;
