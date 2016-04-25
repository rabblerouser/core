import React from 'react';
import LabHeader from './LabHeader.jsx';

const LabDetailsView = ({ selectedLab, onSaveLab, onDeleteLab }) => (
  <section className="admin-section" id="lab-details">
    <h3>{selectedLab.name} Lab
      <LabHeader onSave={onSaveLab} onDelete={onDeleteLab} lab={selectedLab} />
    </h3>
    <dl>
      <dt>Contact</dt>
      <dd className="textblock">{selectedLab.contact}</dd>
      <dt>Notes</dt>
      <dd className="textblock">{selectedLab.notes}</dd>
    </dl>
  </section>
);

LabDetailsView.propTypes = {
  selectedLab: React.PropTypes.object,
};

export default LabDetailsView;
