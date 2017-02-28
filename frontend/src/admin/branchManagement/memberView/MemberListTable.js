import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import { EditButton, DeleteButton } from '../../common';
import { SortedTable } from '../../common/tables';
import { editMember, memberRemoveRequested } from './actions';

const columnsWithAddress = [
  { type: 'name', field: 'memberName', label: 'Member name' },
  { type: 'name', field: 'contactNumber', label: 'Contact information' },
  { type: 'name', field: 'address', label: 'Address' },
  { type: 'name', field: 'memberSince', label: 'Member since' },
  { type: 'actions' },
];

const columnsWithoutAddress = [
  { type: 'name', field: 'memberName', label: 'Member name' },
  { type: 'name', field: 'contactNumber', label: 'Contact information' },
  { type: 'name', field: 'memberSince', label: 'Member since' },
  { type: 'actions' },
];

const mapFields = ({ name, phoneNumber, email, memberSince, address },
                   addressEnabled) => {
  const memberNameField = name;
  const contactNumberField = `${phoneNumber || ''} ${email || ''}`;
  const memberSinceField = moment(memberSince).format('YYYY/MM/DD');

  let addressField;
  if (address) {
    addressField =
      `${address.address || ''}, ${address.suburb || ''}, ${address.state || ''}, ` +
      `${address.postcode || ''}, ${address.country || ''}`;
  } else {
    addressField = '-';
  }

  let fields;
  if (addressEnabled) {
    fields = {
      memberName: memberNameField,
      contactNumber: contactNumberField,
      address: addressField,
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
    onDelete={() => remove(memberId)}
  />,
];

export const MemberListTable = ({
  edit,
  remove,
  members,
  addressEnabled = customisation.addressEnabled,
}) => {
  const columns = addressEnabled ? columnsWithAddress : columnsWithoutAddress;
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

export default connect(() => ({}), { edit: editMember, remove: memberRemoveRequested })(MemberListTable);
