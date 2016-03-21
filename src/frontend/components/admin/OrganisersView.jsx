import React from 'react';
import OrganisersList from './OrganisersList.jsx';

const OrganisersView = ({ organisers, onSaveOrganiser }) => (
    <section className="admin-section">
        <h3>Lab Organisers</h3>
        <OrganisersList onSave={onSaveOrganiser} organisers={organisers} />
    </section>
);

OrganisersView.propTypes = {
    organisers : React.PropTypes.array,
    onSaveOrganiser : React.PropTypes.func
};

export default OrganisersView
