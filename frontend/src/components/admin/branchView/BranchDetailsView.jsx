import React from 'react';
import { connect } from 'react-redux';

import { branchRemoveRequested, branchCreateRequested, branchUpdateRequested } from '../../../actions/branchActions';
import { getSelectedBranch } from '../../../reducers/branchReducers';
import BranchHeader from './BranchHeader';

const BranchDetailsView = ({ selectedBranch, onCreateBranch, onBranchRemoved, onBranchUpdated }) => (
  <section className="admin-section" id="branchDetails">
    <h3>{selectedBranch.name} Branch
      <BranchHeader
        onCreate={onCreateBranch}
        onUpdate={onBranchUpdated}
        onDelete={onBranchRemoved}
        branch={selectedBranch}
      />
    </h3>
    <dl>
      <dt>Contact</dt>
      <dd className="textblock">{selectedBranch.contact}</dd>
      <dt>Notes</dt>
      <dd className="textblock">{selectedBranch.notes}</dd>
    </dl>
  </section>
);

const mapStateToProps = state => ({
  selectedBranch: getSelectedBranch(state),
});

const mapDispatchToProps = dispatch => ({
  onCreateBranch: branch => dispatch(branchCreateRequested(branch)),
  onBranchRemoved: branch => dispatch(branchRemoveRequested(branch)),
  onBranchUpdated: branch => dispatch(branchUpdateRequested(branch)),
});

BranchDetailsView.propTypes = {
  selectedBranch: React.PropTypes.object,
  onCreateBranch: React.PropTypes.func,
  onBranchUpdated: React.PropTypes.func,
  onBranchRemoved: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(BranchDetailsView);
