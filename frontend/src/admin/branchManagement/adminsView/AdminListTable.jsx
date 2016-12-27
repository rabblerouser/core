import React from 'react';
import { connect } from 'react-redux';

import { SortedTable, DeleteButton, EditButton } from '../../common';
import { editAdmin, adminRemoveRequested } from './actions';
import { getAdmins } from './reducers';

const columns = [
  { type: 'name', field: 'name', label: 'Name' },
  { type: 'email', field: 'email', label: 'Email' },
  { type: 'tel', field: 'phoneNumber', label: 'Phone' },
  { type: 'actions' },
];

const mapFields = ({ name, email, phoneNumber }) => ({ name, email, phoneNumber });
const mapActions = (edit, remove, adminId) => [
  <EditButton key={`${adminId}-edit`} onClick={() => { edit(adminId); }} />,
  <DeleteButton
    key={`${adminId}-delete`}
    confirmMessage="Are you sure you want to delete the selected admin?"
    title="Delete admin"
    onDelete={() => remove(adminId)}
  />,
];

export const AdminListTable = ({ edit, remove, admins }) => (
  admins.length === 0 ?
    <aside className="no-entries">No entries found</aside>
    : <SortedTable
      columns={columns}
      data={admins.map(admin => (
        {
          ...mapFields(admin),
          actions: mapActions(edit, remove, admin.id),
        }
      ))}
      sortOn="name"
    />);

const mapStateToProps = state => ({ admins: getAdmins(state) });
const mapDispatchToProps = { edit: editAdmin, remove: adminRemoveRequested };
export default connect(mapStateToProps, mapDispatchToProps)(AdminListTable);

AdminListTable.propTypes = {
  admins: React.PropTypes.array,
  edit: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
};
