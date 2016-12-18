import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { EditButton, DeleteButton, SortedTable } from '../common';
import { editMember } from './actions';

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

const mapFields = ({ firstName, lastName, primaryPhoneNumber, email, memberSince, postalAddress },
                   addressEnabled) => {
  const memberNameField = `${firstName} ${nullToBlank(lastName)}`;
  const contactNumberField = `${primaryPhoneNumber} ${email}`;
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

const mapActions = (onEdit, member, allGroups, onDeleteMember) => [
  <EditButton key={`${member.id}-edit`} onClick={() => { onEdit(member.id); }} />,
  <DeleteButton
    key={`${member.id}-delete`}
    confirmMessage="Are you sure you want to delete the selected member?"
    title="Delete admin"
    onDelete={() => onDeleteMember(member)}
  />,
];

export const MemberListTable = ({
  onEdit,
  members,
  groups,
  onDeleteMember,
  addressEnabled = customisation.addressEnabled,
}) => {
  let columns = addressEnabled ? columnsWithAddress : columnsWithoutAddress;
  return (<SortedTable
    columns={columns}
    data={members.map(member => (
      {
        ...mapFields(member, addressEnabled),
        actions: mapActions(onEdit, member, groups, onDeleteMember),
      }
    ))}
    sortOn="memberName"
  />);
};

MemberListTable.propTypes = {
  members: React.PropTypes.array,
  groups: React.PropTypes.array,
  onDeleteMember: React.PropTypes.func.isRequired,
  onEdit: React.PropTypes.func.isRequired,
  addressEnabled: React.PropTypes.bool,
};

export default connect(() => ({}), { onEdit: editMember })(MemberListTable);
