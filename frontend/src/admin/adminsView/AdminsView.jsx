import React from 'react';
import AddAdminModalLauncher from './AddAdminModalLauncher';
import AdminListTable from './AdminListTable';

const AdminsView = ({ type, id = 'admins', admins, onSaveAdmin, onDeleteAdmin }) =>
  <section className="admin-section" id={id}>
    <h3>
      {type}s
      <AddAdminModalLauncher type={type} onSave={onSaveAdmin} />
    </h3>
    <AdminListTable admins={admins} onSaveAdmin={onSaveAdmin} onDeleteAdmin={onDeleteAdmin} />
    {admins.length === 0 && <aside className="no-entries">No entries found</aside>}
  </section>
;

AdminsView.propTypes = {
  type: React.PropTypes.string.isRequired,
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  admins: React.PropTypes.array,
  onSaveAdmin: React.PropTypes.func.isRequired,
  onDeleteAdmin: React.PropTypes.func.isRequired,
};

export default AdminsView;
