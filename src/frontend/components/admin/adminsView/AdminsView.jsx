import React from 'react';
import OrganisersList from './OrganisersList.jsx';
import AddOrganiserModalLauncher from './AddOrganiserModalLauncher.jsx';

const AdminsView = ({ title, organisers, onSaveOrganiser, onDeleteOrganiser }) => (
    <section className="admin-section" id="lab-organisers">
        <h3>
            {title}
            <AddOrganiserModalLauncher
                onSave={onSaveOrganiser}
            />
        </h3>
        <OrganisersList onSave={onSaveOrganiser} onDelete={onDeleteOrganiser} organisers={organisers} />
    </section>
);

AdminsView.propTypes = {
    title: React.PropTypes.string,
    organisers : React.PropTypes.array,
    onSaveOrganiser : React.PropTypes.func
};

export default AdminsView
