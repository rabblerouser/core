import React from 'react';

const LabDetailsView = ({ selectedLab }) => (
    <section className="admin-section" id="lab-details">
        <h3>{selectedLab.name} Lab</h3>
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
