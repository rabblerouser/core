import React from 'react';
import BranchHeader from './BranchHeader.jsx';

const BranchDetailsView = ({ selectedBranch, onSaveBranch, onDeleteBranch }) => (
  <section className="admin-section" id="branchDetails">
    <h3>{selectedBranch.name} Branch
      <BranchHeader onSave={onSaveBranch} onDelete={onDeleteBranch} branch={selectedBranch} />
    </h3>
    <dl>
      <dt>Contact</dt>
      <dd className="textblock">{selectedBranch.contact}</dd>
      <dt>Notes</dt>
      <dd className="textblock">{selectedBranch.notes}</dd>
    </dl>
  </section>
);

BranchDetailsView.propTypes = {
  selectedBranch: React.PropTypes.object,
};

export default BranchDetailsView;
