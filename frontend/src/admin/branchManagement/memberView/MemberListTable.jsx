import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { EditButton, DeleteButton, SortedTable } from '../../common';
import { editMember, memberRemoveRequested } from './actions';

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

const mapActions = (edit, remove, memberId) => [
  <EditButton key={`${memberId}-edit`} onClick={() => { edit(memberId); }} />,
  <DeleteButton
    key={`${memberId}-delete`}
    confirmMessage="Are you sure you want to delete the selected member?"
    title="Delete member"
    onDelete={remove}
  />,
];

export const MemberListTable = ({
  edit,
  remove,
  members,
  addressEnabled = customisation.addressEnabled,
}) => {
  let columns = addressEnabled ? columnsWithAddress : columnsWithoutAddress;
  return (<SortedTable
    columns={columns}
    data={members.map(member => (
      {
        ...mapFields(member, addressEnabled),
        actions: mapActions(edit, remove, member.id),
      }
    ))}
    sortOn="memberName"
  />);
};

MemberListTable.propTypes = {
  members: React.PropTypes.array,
  edit: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  addressEnabled: React.PropTypes.bool,
};

export default connect(() => ({}), { edit: editMember, remove: memberRemoveRequested })(MemberListTable);
