import React, { Component } from 'react';
import styled from 'styled-components';

import Table from './Table';
import sortColumn from '../../../lib/sortColumn';

const TableAside = styled.aside`
    padding: 15px;
    font-size: 14px;
    background-color: ${props => props.theme.lightGrey};
    font-style: italic;
`;


class SortedTable extends Component {
  constructor(props) {
    super(props);
    this.onSort = this.onSort.bind(this);
    this.state = sortColumn(props.sortOn, props.columns, props.data);
  }

  componentWillReceiveProps(props) {
    this.setState(sortColumn(props.sortOn, props.columns, props.data));
  }

  onSort(field) {
    this.setState(sortColumn(field, this.state.columns, this.state.data));
  }

  render() {
    return (
      this.state.data.length === 0 ?
        <TableAside>No entries found</TableAside>
        :
        <Table
          columns={this.state.columns}
          data={this.state.data}
          onClickHeader={this.onSort}
        />
    );
  }
}

export default SortedTable;
