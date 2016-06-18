import React, { Component } from 'react';
import Table from './Table.jsx';
import sortColumn from '../../lib/sortColumn.js';

const SortedTable = class SortedTable extends Component {

  onSort(field) {
    this.setState(sortColumn(field, this.state.columns, this.state.data));
  }

  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
    this.state = sortColumn(props.sortOn, props.columns, props.data);
  }

  componentWillReceiveProps(props) {
    this.setState(sortColumn(props.sortOn, props.columns, props.data));
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
