'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import {sortByOrder, map} from 'lodash';
const Table = require('reactabular').Table;
import sortColumn from '../../lib/sortColumn.js';
const moment = require('moment');
const classnames = require('classnames');
import GroupsList from './GroupsList.jsx';
import EditMemberModalLauncher from './EditMemberModalLauncher.jsx'

function tableColumns() {
    return [
        {
            property: 'firstName',
            header: 'Participant',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].firstName + " " + participants[rowIndex].lastName,
            headerClass: classnames('participant')
        },
        {
            property: 'contactFirstName',
            header: 'Parent / Guardian',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].contactFirstName + " " + participants[rowIndex].contactLastName,
            headerClass: classnames('parent')
        },
        {
            property: 'primaryPhoneNumber',
            header: 'Contact information',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].primaryPhoneNumber + " " + participants[rowIndex].email,
            headerClass: classnames('contact')
        },
        {
            property: 'dateOfBirth',
            header: 'Birth year',
            cell: (dob) => dob.substring(0,4),
            headerClass: classnames('birth-year')
        },
        {
            property: 'schoolType',
            header: 'School type',
            headerClass: classnames('school-type')
        },
        {
            property: 'memberSince',
            header: 'Date registered',
            cell: (date) => moment(date).format('YYYY/MM/DD'),
            headerClass: classnames('date-registered')
        },
        {
            property: 'additionalInfo',
            header: 'Notes',
            headerClass: classnames('notes')
        },
        {
            property: 'Groups',
            header: 'Groups',
            cell: (groups) => <GroupsList editable={false} groups={groups} />,
            headerClass: classnames('groups')
        },
        {
            cell: (nothing, participants, rowIndex) => {
                return {
                    value: <EditMemberModalLauncher participant={participants[rowIndex]} groups={participants[rowIndex].allGroups}/>
                };
            },
            headerClass: classnames('edit')
        }
    ];
}

export default class ParticipantsList extends Component {


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
        let data = sortColumn.sort(this.props.participants, this.state.sortingColumn, sortByOrder);

        let lessHacky = data.map((participant) => {
            participant.allGroups = this.props.groups;
            return participant;
        });

        return (
            <Table columns={this.state.columns} data={lessHacky} columnNames={this.state.columnNames}/>
        );
    }
}
