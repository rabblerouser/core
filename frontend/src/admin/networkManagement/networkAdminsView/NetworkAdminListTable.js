import React from 'react';
import { connect } from 'react-redux';

import { DeleteButton, EditButton } from '../../common';
import { SortedTable } from '../../common/tables';
import { editNetworkAdmin, networkAdminRemoveRequested } from './actions';
import { getNetworkAdmins } from './reducers';
import { getUserEmail } from '../../reducers/userReducers';

const columns = [
  { type: 'name', field: 'name', label: 'Name' },
  { type: 'email', field: 'email', label: 'Email' },
  { type: 'tel', field: 'phoneNumber', label: 'Phone' },
  { type: 'actions' },
];

const mapFields = ({ name, email, phoneNumber }) => ({ name, email, phoneNumber });
const removeActionButton = (remove, networkAdmin, userEmail) => {
  if (userEmail === networkAdmin.email) return null;
  return (
    <DeleteButton
      key={`${networkAdmin.id}-delete`}
      confirmMessage="Are you sure you want to delete the selected network admin?"
      title="Delete network admin"
      onDelete={() => remove(networkAdmin.id)}
    />
  );
};

const mapActions = (edit, remove, userEmail, networkAdmin) => [
  <EditButton key={`${networkAdmin.id}-edit`} onClick={() => { edit(networkAdmin.id); }} />,
  removeActionButton(remove, networkAdmin, userEmail),
];

export const NetworkAdminListTable = ({ edit, remove, userEmail, networkAdmins }) => (
  <SortedTable
    columns={columns}
    data={networkAdmins.map(networkAdmin => (
      {
        ...mapFields(networkAdmin),
        actions: mapActions(edit, remove, userEmail, networkAdmin),
      }
        ))}
    sortOn="name"
  />);

const mapStateToProps = state => ({ networkAdmins: getNetworkAdmins(state), userEmail: getUserEmail(state) });
const mapDispatchToProps = { edit: editNetworkAdmin, remove: networkAdminRemoveRequested };
export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminListTable);
