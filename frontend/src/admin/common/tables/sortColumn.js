import { findWhere, sortByOrder, isString } from 'lodash';

const SORT = { none: 'none', asc: 'asc', desc: 'desc' };
const setDirection = curr => (curr === SORT.asc ? SORT.desc : SORT.asc);

function caseInsensitive(field) {
  return d => (isString(d[field]) ? d[field].toLowerCase() : d[field]);
}

const sortColumn = (field, columns, data) => {
  const updatedColumns = columns.map(c =>
    Object.assign({}, c, { direction: c.field === field ? setDirection(c.direction) : SORT.none }),
  );
  const sortedColumn = findWhere(updatedColumns, { field });
  const direction = !!sortedColumn && sortedColumn.direction === SORT.desc ? 'desc' : 'asc';
  const sorted = sortByOrder(data, caseInsensitive(field), direction);

  return { columns: updatedColumns, data: sorted };
};

export default sortColumn;
