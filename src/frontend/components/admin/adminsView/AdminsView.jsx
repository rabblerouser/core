import React from 'react';
import AdminsList from './AdminsList.jsx';
import AddAdminModalLauncher from './AddAdminModalLauncher.jsx';

const AdminsView = ({ title, admins, onSaveAdmin, onDeleteAdmin }) => (
    <section className="admin-section" id="lab-admins">
        <h3>
            {title}
            <AddAdminModalLauncher
                onSave={onSaveAdmin}
            />
        </h3>
        <AdminsList onSave={onSaveAdmin} onDelete={onDeleteAdmin} admins={admins} />
    </section>
);

AdminsView.propTypes = {
    title: React.PropTypes.string,
    admins : React.PropTypes.array,
    onSaveAdmin : React.PropTypes.func
};

export default AdminsView
