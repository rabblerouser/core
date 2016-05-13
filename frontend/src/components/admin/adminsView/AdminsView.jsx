import React from 'react';
import AdminsList from './AdminsList.jsx';
import AddAdminModalLauncher from './AddAdminModalLauncher.jsx';

const AdminsView = ({ type, id = 'admins', admins, onSaveAdmin, onDeleteAdmin }) => (
  <section className="admin-section" id={id}>
    <h3>
      {type}s
      <AddAdminModalLauncher
        type={type}
        onSave={onSaveAdmin}
      />
    </h3>
    <AdminsList type={type} onSave={onSaveAdmin} onDelete={onDeleteAdmin} admins={admins} />
  </section>
);

AdminsView.propTypes = {
  type: React.PropTypes.string,
  id: React.PropTypes.string,
  title: React.PropTypes.string,
  admins: React.PropTypes.array,
  onSaveAdmin: React.PropTypes.func,
  onDeleteAdmin: React.PropTypes.func,
};

export default AdminsView;
