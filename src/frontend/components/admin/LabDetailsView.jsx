import React from 'react';

const LabDetailsView = ({ selectedLab }) => (
    <section>
        <header>{selectedLab.name} Lab</header>
        <dl>
            <dh>Contact</dh>
            <dd>{selectedLab.description}</dd>
            <dh>Notes</dh>
            <dd>{selectedLab.notes}</dd>
        </dl>
    </section>

);


LabDetailsView.propTypes = {
    selectedLab : React.PropTypes.object
};

export default LabDetailsView
