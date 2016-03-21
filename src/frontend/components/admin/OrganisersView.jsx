import React from 'react';
import OrganisersList from './OrganisersList.jsx';

const OrganisersView = ({ organisers }) => (
    <section>
        <header>Lab Organisers</header>
        <OrganisersList organisers={organisers} />
    </section>
);


OrganisersView.propTypes = {
    organisers : React.PropTypes.array
};

export default OrganisersView
