import React from 'react';
import AddLabModalLauncher from './AddLabModalLauncher.jsx';
import EditLabModalLauncher from './EditLabModalLauncher.jsx';

const LabDetailsView = ({ selectedLab, onSaveLab }) => (
    <section className="admin-section" id="lab-details">
        <h3>{selectedLab.name} Lab
            <AddLabModalLauncher
                onSave={onSaveLab}
            />
        </h3>

        <span className="actions">
            <EditLabModalLauncher onSave={ onSaveLab } lab={ selectedLab }/>
        </span>
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
