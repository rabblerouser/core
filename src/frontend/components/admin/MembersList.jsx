'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import {sortByOrder, map} from 'lodash';
const Table = require('reactabular').Table;
const sortColumn = require('reactabular').sortColumn;
const moment = require('moment');
import GroupsList from './GroupsList.jsx';

import EditMemberModalLauncher from './EditMemberModalLauncher.jsx'

function tableColumns(props) {
    return [
        {
            header: 'Participant',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].firstName + " " + participants[rowIndex].lastName
        },
        {
            header: 'Parent / Guardian',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].contactFirstName + " " + participants[rowIndex].contactLastName
        },
        {
            header: 'Contact information',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].primaryPhoneNumber + " " + participants[rowIndex].email
        },
        {
            property: 'dateOfBirth',
            header: 'Birth year',
            cell: (dob) => dob.substring(0,4)
        },
        {
            property: 'schoolType',
            header: 'School type'
        },
        {
            property: 'memberSince',
            header: 'Date registered',
            cell: (date) => moment(date).format('YYYY/MM/DD')
        },
        {
            property: 'additionalInfo',
            header: 'Notes'
        },
        {
            property: 'Groups',
            header: 'Groups',
            cell: (groups) => <GroupsList groups={groups} />
        },
        {
            cell: (nothing, participants, rowIndex) => {
                return {
                    value: <EditMemberModalLauncher participant={participants[rowIndex]} groups={props.groups}/>
                };
            }
        }
    ];
}

export default class ParticipantsList extends Component {
    constructor(props) {
        super(props);
        this.state  = {
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
        let data = sortColumn.sort(this.props.participants, this.state.sortingColumn, sortByOrder);

        return (
            <Table columns={tableColumns(this.props)} data={data} columnNames={this.state.columnNames} />
        );
    }
}
