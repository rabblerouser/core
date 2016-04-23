import React from 'react';
import AdminsList from './AdminsList.jsx';
import AddAdminModalLauncher from './AddAdminModalLauncher.jsx';

const AdminsView = ({ type, admins, onSaveAdmin, onDeleteAdmin }) => (
  <section className="admin-section" id="organisers">
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
  title: React.PropTypes.string,
  admins: React.PropTypes.array,
  onSaveAdmin: React.PropTypes.func,
};

export default AdminsView;
