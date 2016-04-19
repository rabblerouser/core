import { isString } from 'lodash';

const sortColumn = (columns, column, done) => {
  // reset old classes
  columns.forEach(col => {
    col.headerClass = col.headerClass.replace('sort-asc', '');
    col.headerClass = col.headerClass.replace('sort-desc', '');
  });

  column.sort = column.sort === 'asc' ? 'desc' : 'asc';

  // push sorting hint
  column.headerClass += ` sort-${column.sort}`;

  done({
    sortingColumn: column,
    columns,
  });
};

// sorter === lodash sortByOrder
// https://lodash.com/docs#sortByOrder
sortColumn.sort = (data, column, sorter) => {
  if (!column) {
    return data;
  }

  const sortFn = row => {
    const value = row[column.property];
    return isString(value) ? value.toLowerCase() : value;
  };

  return sorter(data, [sortFn], [column.sort]);
};

export default sortColumn;
