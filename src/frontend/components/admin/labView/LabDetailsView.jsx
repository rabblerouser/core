import React from 'react';
import LabHeader from './LabHeader.jsx';

const LabDetailsView = ({ selectedLab, onSaveLab, onDeleteLab }) => (
    <section className="admin-section" id="lab-details">
        <h3>{selectedLab.name} Lab
            <LabHeader
                onSave={onSaveLab}
                onDelete={onDeleteLab}
                lab={selectedLab}
            />
        </h3>
        <dl>
            <dh>Contact</dh>
            <dd>{selectedLab.contact}</dd>
            <dh>Notes</dh>
            <dd>{selectedLab.notes}</dd>
        </dl>
    </section>
);

LabDetailsView.propTypes = {
    selectedLab : React.PropTypes.object
};

export default LabDetailsView
