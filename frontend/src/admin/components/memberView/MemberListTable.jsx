import React from 'react';
import SortedTable from '../../common/SortedTable';
import EditMemberModalLauncher from './EditMemberModalLauncher';
import DeleteButton from '../../common/DeleteButton';
import moment from 'moment';

const columnsWithAddress = [
  { type: 'name', field: 'memberName', label: 'Member name' },
  { type: 'name', field: 'contactNumber', label: 'Contact information' },
  { type: 'name', field: 'postalAddress', label: 'Postal Address' },
  { type: 'name', field: 'memberSince', label: 'Member since' },
  { type: 'actions' },
];

const columnsWithoutAddress = [
  { type: 'name', field: 'memberName', label: 'Member name' },
  { type: 'name', field: 'contactNumber', label: 'Contact information' },
  { type: 'name', field: 'memberSince', label: 'Member since' },
  { type: 'actions' },
];

function nullToBlank(input) {
  return input === null ? '' : input;
}

const mapFields = ({ memberName, memberLastName, contactNumber, contactEmail, memberSince, postalAddress },
                   addressEnabled) => {
  const memberNameField = `${memberName} ${nullToBlank(memberLastName)}`;
  const contactNumberField = `${contactNumber} ${contactEmail}`;
  const memberSinceField = moment(memberSince).format('YYYY/MM/DD');

  let postalAddressField;
  if (postalAddress) {
    postalAddressField =
      `${postalAddress.address}, ${postalAddress.suburb}, ${postalAddress.state}, ` +
      `${postalAddress.postcode}, ${postalAddress.country}`;
  } else {
    postalAddressField = '-';
  }

  let fields;
  if (addressEnabled) {
    fields = {
      memberName: memberNameField,
      contactNumber: contactNumberField,
      postalAddress: postalAddressField,
      memberSince: memberSinceField,
    };
  } else {
    fields = {
      memberName: memberNameField,
      contactNumber: contactNumberField,
      memberSince: memberSinceField,
    };
  }
  return fields;
};

const mapActions = (member, allGroups, onSaveMember, onDeleteMember) => [
  <EditMemberModalLauncher key={`${member.id}-edit`} member={{ ...member, allGroups }} onSave={onSaveMember} />,
  <DeleteButton
    key={`${member.id}-delete`}
    confirmMessage="Are you sure you want to delete the selected member?"
    title="Delete admin"
    onDelete={() => onDeleteMember(member)}
  />,
];

const MemberListTable = ({ members, groups, onSaveMember, onDeleteMember,
                           addressEnabled = customisation.addressEnabled }) => {
  let columns = addressEnabled ? columnsWithAddress : columnsWithoutAddress;
  return (<SortedTable
    columns={columns}
    data={members.map(member => (
      { ...mapFields(member, addressEnabled), actions: mapActions(member, groups, onSaveMember, onDeleteMember) }
    ))}
    sortOn="memberName"
  />);
};

export default MemberListTable;

MemberListTable.propTypes = {
  members: React.PropTypes.array,
  groups: React.PropTypes.array,
  onSaveMember: React.PropTypes.func.isRequired,
  onDeleteMember: React.PropTypes.func.isRequired,
  addressEnabled: React.PropTypes.bool,
};
