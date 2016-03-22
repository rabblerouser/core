import React from 'react';
import AddLabModalLauncher from './AddLabModalLauncher.jsx';

const LabDetailsView = ({ selectedLab, onSaveLab }) => (
    <section className="admin-section" id="lab-details">
        <h3>{selectedLab.name} Lab
            <AddLabModalLauncher
                onSave={onSaveLab}
            />
        </h3>
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
