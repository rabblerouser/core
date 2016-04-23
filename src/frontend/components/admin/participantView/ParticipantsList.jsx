import React, { Component } from 'react';
import { sortByOrder } from 'lodash';
const Table = require('reactabular').Table;
import sortColumn from '../../../lib/sortColumn.js';
import moment from 'moment';
import classnames from 'classnames';
import EditMemberModalLauncher from './EditMemberModalLauncher.jsx';

function nullToBlank(input) {
  return input === null ? '' : input;
}

function tableColumns(onSave) {
  return [
    {
      property: 'participantName',
      header: 'Participant name',
      cell: (nothing, participants, rowIndex) => ({
        value: (
          <span>
            {`${participants[rowIndex].participantName} ${nullToBlank(participants[rowIndex].participantLastName)}`}
          </span>
        ),
      }),
      headerClass: classnames('name participant'),
    },
    {
      property: 'contactFirstName',
      header: 'Contact name',
      cell: (nothing, participants, rowIndex) => (
        `${participants[rowIndex].contactName} ${nullToBlank(participants[rowIndex].contactLastName)}`
      ),
      headerClass: classnames('name parent'),
    },
    {
      property: 'contactNumber',
      header: 'Contact information',
      cell: (nothing, participants, rowIndex) => ({
        value: (
          <dl>
            <dd>{participants[rowIndex].contactNumber}</dd>
            <dd>{participants[rowIndex].contactEmail}</dd>
          </dl>
        ),
      }),
      headerClass: classnames('contact'),
    },
    {
      property: 'memberSince',
      header: 'Date applied',
      cell: date => moment(date).format('YYYY/MM/DD'),
      headerClass: classnames('date date-registered'),
    },
    {
      property: 'pastoralNotes',
      header: 'Pastoral notes',
      headerClass: classnames('notes'),
    },
    {
      cell: (nothing, participants, rowIndex) => ({
        value: <EditMemberModalLauncher participant={participants[rowIndex]} onSave={onSave} />,
      }),
      headerClass: classnames('edit'),
    },
  ];
}

export default class ParticipantsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: tableColumns(this.props.onSave),
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
    const data = sortColumn.sort(this.props.participants, this.state.sortingColumn, sortByOrder);
    const lessHacky = data.map(participant => {
      participant.allGroups = this.props.groups;
      return participant;
    });

    return (
      <section className="admin-section" id="participant-list">
        <Table columns={this.state.columns} data={lessHacky} columnNames={this.state.columnNames} />
        {this.props.participants.length === 0 ? <aside className="no-entries">No participants</aside> : ''}
      </section>
    );
  }
}
