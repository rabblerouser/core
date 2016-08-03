import React from 'react';
import SortedTable from '../../common/SortedTable.jsx';
import EditMemberModalLauncher from './EditMemberModalLauncher.jsx';
import DeleteButton from '../../common/DeleteButton.jsx';
import moment from 'moment';

const columns = [
  { type: 'name', field: 'memberName', label: 'Member name' },
  { type: 'name', field: 'contactNumber', label: 'Contact information' },
  { type: 'name', field: 'memberSince', label: 'Member since' },
  { type: 'name', field: 'pastoralNotes', label: 'Pastoral notes' },
  { type: 'actions' },
];

function nullToBlank(input) {
  return input === null ? '' : input;
}

const mapFields = ({ memberName,
  memberLastName,
  contactNumber,
  contactEmail,
  memberSince,
  pastoralNotes }) => (
  {
    memberName: `${memberName} ${nullToBlank(memberLastName)}`,
    contactNumber: `${contactNumber}\n${contactEmail}`,
    memberSince: moment(memberSince).format('YYYY/MM/DD'),
    pastoralNotes,
  }
);
const mapActions = (member, allGroups, onSaveMember, onDeleteMember) => [
  <EditMemberModalLauncher key={`${member.id}-edit`} member={{ ...member, allGroups }} onSave={onSaveMember} />,
  false && <DeleteButton
    key={`${member.id}-delete`}
    confirmMessage="Are you sure you want to delete the selected member?"
    title="Delete admin"
    onDelete={() => onDeleteMember(member)}
  />,
];

const MemberListTable = ({ members, groups, onSaveMember, onDeleteMember }) => (
  <SortedTable
    columns={columns}
    data={members.map(member => (
      { ...mapFields(member), actions: mapActions(member, groups, onSaveMember, onDeleteMember) }
    ))}
    sortOn="memberName"
  />
);

export default MemberListTable;

MemberListTable.propTypes = {
  members: React.PropTypes.array,
  groups: React.PropTypes.array,
  onSaveMember: React.PropTypes.func.isRequired,
  onDeleteMember: React.PropTypes.func.isRequired,
};
