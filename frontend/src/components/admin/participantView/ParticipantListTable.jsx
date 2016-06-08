import React from 'react';
import SortedTable from '../../common/SortedTable.jsx';
import EditMemberModalLauncher from './EditMemberModalLauncher.jsx';
import moment from 'moment';

const columns = [
  { type: 'name', field: 'participantName', label: 'Participant name' },
  { type: 'name', field: 'contactFirstName', label: 'Contact name' },
  { type: 'name', field: 'contactNumber', label: 'Contact information' },
  { type: 'name', field: 'memberSince', label: 'Date applied' },
  { type: 'name', field: 'pastoralNotes', label: 'Pastoral notes' },
  { type: 'actions' },
];

function nullToBlank(input) {
  return input === null ? '' : input;
}

const mapFields = ({ participantName,
  participantLastName,
  contactName,
  contactLastName,
  contactNumber,
  contactEmail,
  memberSince,
  pastoralNotes }) => (
  {
    participantName: `${participantName} ${nullToBlank(participantLastName)}`,
    contactFirstName: `${contactName} ${nullToBlank(contactLastName)}`,
    contactNumber: `${contactNumber}\n${contactEmail}`,
    memberSince: moment(memberSince).format('YYYY/MM/DD'),
    pastoralNotes,
  }
);
const mapActions = (participant, onSaveMember, allGroups) => [
  <EditMemberModalLauncher participant={Object.assign({}, participant, { allGroups })} onSave={onSaveMember} />,
];

const ParticipantListTable = ({ participants, onSaveMember, groups }) =>
  <SortedTable
    columns={columns}
    data={participants.map(participant =>
      Object.assign({}, mapFields(participant), { actions: mapActions(participant, onSaveMember, groups) })
    )}
    sortOn="participantName"
  />;

export default ParticipantListTable;

ParticipantListTable.propTypes = {
  participants: React.PropTypes.array,
  groups: React.PropTypes.array,
  onSaveMember: React.PropTypes.func.isRequired,
};
