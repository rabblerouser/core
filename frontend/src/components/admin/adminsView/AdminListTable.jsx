import React from 'react';
import SortedTable from '../../common/SortedTable.jsx';
import EditAdminModalLauncher from './EditAdminModalLauncher.jsx';
import DeleteAdminButton from './DeleteAdminButton.jsx';

const columns = [
  { type: 'name', field: 'name', label: 'Name' },
  { type: 'email', field: 'email', label: 'Email' },
  { type: 'tel', field: 'phoneNumber', label: 'Phone' },
  { type: 'actions' },
];

const mapFields = ({ name, email, phoneNumber }) => ({ name, email, phoneNumber });
const mapActions = (admin, onSaveAdmin, onDeleteAdmin) => [
  <EditAdminModalLauncher key={`${admin.id}-edit`} admin={admin} onSave={onSaveAdmin} />,
  <DeleteAdminButton key={`${admin.id}-delete`} admin={admin} onDelete={onDeleteAdmin} />,
];

const AdminListTable = ({ admins, onSaveAdmin, onDeleteAdmin }) =>
  <SortedTable
    columns={columns}
    data={admins.map(admin =>
      Object.assign({}, mapFields(admin), { actions: mapActions(admin, onSaveAdmin, onDeleteAdmin) })
    )}
    sortOn="name"
  />;

export default AdminListTable;

AdminListTable.propTypes = {
  admins: React.PropTypes.array,
  onSaveAdmin: React.PropTypes.func.isRequired,
  onDeleteAdmin: React.PropTypes.func.isRequired,
};
