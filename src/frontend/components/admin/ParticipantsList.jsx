'use strict';

import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import {sortByOrder, map} from 'lodash';
const Table = require('reactabular').Table;
import sortColumn from '../../lib/sortColumn.js';
const moment = require('moment');
const classnames = require('classnames');
import ParticipantGroupsList from './ParticipantGroupsList.jsx';
import EditMemberModalLauncher from './EditMemberModalLauncher.jsx';

function tableColumns(onSave) {
    return [
        {
            property: 'participantName',
            header: 'Participant',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].participantName + " " + participants[rowIndex].participantLastName,
            headerClass: classnames('participant')
        },
        {
            property: 'contactFirstName',
            header: 'Parent / Guardian',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].contactFirstName + " " + participants[rowIndex].contactLastName,
            headerClass: classnames('parent')
        },
        {
            property: 'contactNumber',
            header: 'Contact information',
            cell: (nothing, participants, rowIndex) => participants[rowIndex].contactNumber + " " + participants[rowIndex].contactEmail,
            headerClass: classnames('contact')
        },
        {
            property: 'participantBirthYear',
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
            property: 'groups',
            header: 'Groups',
            cell: (groups, participants, rowIndex) => {
                let groupDetails =  participants[rowIndex].allGroups.filter((group) => {
                     return groups.includes(group.id);
                 });
                return {
                 value: <ParticipantGroupsList editable={false} groups={ groupDetails } />
                }
            },
            headerClass: classnames('groups')
        },
        {
            cell: (nothing, participants, rowIndex) => {
                return {
                    value: <EditMemberModalLauncher participant={participants[rowIndex]} onSave={ onSave }/>
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
            columns: tableColumns(this.props.onSave),
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
