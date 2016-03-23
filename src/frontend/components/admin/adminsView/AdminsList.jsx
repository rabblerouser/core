'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import {sortByOrder, map} from 'lodash';
const Table = require('reactabular').Table;
import sortColumn from '../../../lib/sortColumn.js';
const classnames = require('classnames');
import EditAdminModalLauncher from './EditAdminModalLauncher.jsx';
import DeleteAdminButton from './DeleteAdminButton.jsx';

function tableColumns(onSave, onDelete) {
    return [
        {
            property: 'name',
            header: 'Name',
            headerClass: classnames('name')
        },
        {
            property: 'phoneNumber',
            header: 'Phone',
            headerClass: classnames('contact')
        },
        {
            property: 'email',
            header: 'Email',
            headerClass: classnames('contact')
        },
        {
            cell: (nothing, admin, rowIndex) => {
                return {
                    value: (<div>
                                <EditAdminModalLauncher admin={admin[rowIndex]} onSave={ onSave }/>
                                <DeleteAdminButton admin={admin[rowIndex]} onDelete={ onDelete }/>
                            </div>)
                };
            },
            headerClass: classnames('edit')
        }
    ];
}

export default class AdminsList extends Component {

    constructor(props) {
        super(props);
        this.state  = {
            columns: tableColumns(this.props.onSave, this.props.onDelete),
            columnNames: {
                onClick: (column) => {
                    sortColumn(
                        this.state.columns,
                        column,
                        this.setState.bind(this)
                    );
                }
            }
        };
    }

    render() {
        let data = sortColumn.sort(this.props.admins, this.state.sortingColumn, sortByOrder);

        return (
            <Table columns={this.state.columns} data={data} columnNames={this.state.columnNames}/>
        );
    }
}
