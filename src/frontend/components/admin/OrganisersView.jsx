import React from 'react';
import OrganisersList from './OrganisersList.jsx';

const OrganisersView = ({ organisers }) => (
    <section className="admin-section">
        <h3>Lab Organisers</h3>
        <OrganisersList organisers={organisers} />
    </section>
);


OrganisersView.propTypes = {
    organisers : React.PropTypes.array
};

export default OrganisersView
