import React, { Component } from 'react';
import Table from './Table.jsx';
import _ from 'lodash';

const SORT = { none: 'none', asc: 'asc', desc: 'desc' };
const setDirection = curr => (curr === SORT.asc ? SORT.desc : SORT.asc);

const SortedTable = class SortedTable extends Component {

  sort(field, columns, data) {
    const updatedColoumns = columns.map(c =>
      Object.assign({}, c, { sortDirection: c.field === field ? setDirection(c.sortDirection) : SORT.none })
    );
    const sortColumn = _.findWhere(updatedColoumns, { field });
    const sorted = _.sortByOrder(data, field, !!sortColumn && sortColumn.direction === SORT.desc ? 'desc' : 'asc');
    return { columns: updatedColoumns, data: sorted };
  }

  onSort(field) {
    this.setState(this.sort(field, this.state.columns, this.state.data));
  }

  constructor(props) {
    super(props);
    this.sort = this.sort.bind(this);
    this.onSort = this.onSort.bind(this);
    this.state = this.sort(props.sortOn, props.columns, props.data);
  }

  componentWillReceiveProps(props) {
    this.setState(this.sort(props.sortOn, props.columns, props.data));
  }

  render() {
    return (
      <Table
        columns={this.state.columns}
        data={this.state.data}
        onClickHeader={this.onSort}
      />
    );
  }
};

export default SortedTable;

SortedTable.propTypes = {
  columns: React.PropTypes.array.isRequired,
  data: React.PropTypes.array.isRequired,
  sortOn: React.PropTypes.string,
};
