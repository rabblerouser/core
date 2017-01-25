import React from 'react';
import { connect } from 'react-redux';

import { DeleteButton, EditButton } from '../../common';
import { SortedTable } from '../../common/tables';
import { editNetworkAdmin, networkAdminRemoveRequested } from './actions';
import { getNetworkAdmins } from './reducers';

const columns = [
  { type: 'name', field: 'name', label: 'Name' },
  { type: 'email', field: 'email', label: 'Email' },
  { type: 'tel', field: 'phoneNumber', label: 'Phone' },
  { type: 'actions' },
];

const mapFields = ({ name, email, phoneNumber }) => ({ name, email, phoneNumber });
const mapActions = (edit, remove, networkAdminId) => [
  <EditButton key={`${networkAdminId}-edit`} onClick={() => { edit(networkAdminId); }} />,
  <DeleteButton
    key={`${networkAdminId}-delete`}
    confirmMessage="Are you sure you want to delete the selected network admin?"
    title="Delete network admin"
    onDelete={() => remove(networkAdminId)}
  />,
];

export const NetworkAdminListTable = ({ edit, remove, networkAdmins }) => (
  <SortedTable
    columns={columns}
    data={networkAdmins.map(networkAdmin => (
      {
        ...mapFields(networkAdmin),
        actions: mapActions(edit, remove, networkAdmin.id),
      }
        ))}
    sortOn="name"
  />);

const mapStateToProps = state => ({ networkAdmins: getNetworkAdmins(state) });
const mapDispatchToProps = { edit: editNetworkAdmin, remove: networkAdminRemoveRequested };
export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminListTable);
