import React, { Component } from 'react';
import { sortByOrder } from 'lodash';
const Table = require('reactabular').Table;
import sortColumn from '../../../lib/sortColumn.js';
const classnames = require('classnames');
import EditAdminModalLauncher from './EditAdminModalLauncher.jsx';
import DeleteAdminButton from './DeleteAdminButton.jsx';

export default class AdminsList extends Component {

  tableColumns() {
    return [
      {
        property: 'name',
        header: 'Name',
        headerClass: classnames('name'),
      },
      {
        property: 'phoneNumber',
        header: 'Phone',
        headerClass: classnames('contact'),
      },
      {
        property: 'email',
        header: 'Email',
        headerClass: classnames('contact'),
      },
      {
        cell: (nothing, admin, rowIndex) => ({
          value: (
            <div>
              <EditAdminModalLauncher type={this.props.type} admin={admin[rowIndex]} onSave={this.props.onSave} />
              <DeleteAdminButton type={this.props.type} admin={admin[rowIndex]} onDelete={this.props.onDelete} />
            </div>
          ),
        }),
        headerClass: classnames('edit'),
      },
    ];
  }

  constructor(props) {
    super(props);
    this.state = {
      columns: this.tableColumns(),
      columnNames: {
        onClick: column => {
          sortColumn(
            this.state.columns,
            column,
            this.setState.bind(this)
          );
        },
      },
    };
  }

  render() {
    const data = sortColumn.sort(this.props.admins, this.state.sortingColumn, sortByOrder);
    return (
      <section>
        <Table columns={this.state.columns} data={data} columnNames={this.state.columnNames} />
        {
          this.props.admins.length === 0 ?
            (<aside className="no-entries">{this.props.type ? `No ${this.props.type.toLowerCase()}s` : ''}</aside>) :
            ''
        }
      </section>
    );
  }
}
