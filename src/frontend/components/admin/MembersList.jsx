'use strict';
import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import {sortByOrder} from 'lodash';
const Table = require('reactabular').Table;
const sortColumn = require('reactabular').sortColumn;
const moment = require('moment');

function tableColumns() {
    return [
        {
            property: 'memberSince',
            header: 'Member Since',
            cell: (date) => moment(date).format('YYYY/MM/DD HH:mm')
        },
        {
            property: 'firstName',
            header: 'Participant’s Name'
        },
        {
            property: 'lastName',
            header: 'Participant’s Last Name'
        },
        {
            property: 'contactFirstName',
            header: 'Parent’s Name'
        },
        {
            property: 'contactLastName',
            header: 'Parent’s Last Name'
        },
        {
            property: 'primaryPhoneNumber',
            header: 'Phone Number'
        },
        {
            property: 'email',
            header: 'Email'
        },
        {
            property: 'dateOfBirth',
            header: 'Year of Birth',
            cell: (dob) => dob.substring(0,4)
        },
        {
            property: 'schoolType',
            header: 'School Type'
        },
        {
            property: 'additionalInfo',
            header: 'Notes'
        }
    ];
}

export default class MembersList extends Component {
    constructor(props) {
        super(props);
        this.state  = {
            columns: tableColumns(),
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
        let data = sortColumn.sort(this.props.members, this.state.sortingColumn, sortByOrder);

        return (
            <div className="admin-container">
                <div className="container">
                    <Table columns={this.state.columns} data={data} columnNames={this.state.columnNames} />
                </div>
            </div>);
    }
}
