import React from 'react';
import { connect } from 'react-redux';

import BranchHeader from './BranchHeader';
import branchService from '../../../services/branchService.js';
import {
  branchUpdated,
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../../../actions/';

import { branchRemoveRequested } from '../../../actions/branchActions';

import { getSelectedBranch, getAvailableBranches } from '../../../reducers/branchReducers';

const BranchDetailsView = ({
  selectedBranch,
  onBranchUpdate,
  onBranchRemoved,
  onActivityStart,
  onActivitySuccess,
  onActivityFailure,
  branches }) => {
  const onSaveBranch = branchDetails => {
    onActivityStart();
    const saveAction = branches.find(branch => branch.id === branchDetails.id) === undefined ?
      branchService.createBranch : branchService.updateBranch;
    saveAction(branchDetails, selectedBranch.id)
      .then(savedBranch => {
        onBranchUpdate(savedBranch);
        onActivitySuccess('Branches successfully saved');
      })
      .catch(onActivityFailure);
  };

  return (
    <section className="admin-section" id="branchDetails">
      <h3>{selectedBranch.name} Branch
        <BranchHeader onSave={onSaveBranch} onDelete={onBranchRemoved} branch={selectedBranch} />
      </h3>
      <dl>
        <dt>Contact</dt>
        <dd className="textblock">{selectedBranch.contact}</dd>
        <dt>Notes</dt>
        <dd className="textblock">{selectedBranch.notes}</dd>
      </dl>
    </section>
  );
};

const mapStateToProps = state => ({
  branches: getAvailableBranches(state),
  selectedBranch: getSelectedBranch(state),
});

const mapDispatchToProps = dispatch => ({
  onBranchRemoved: branch => dispatch(branchRemoveRequested(branch)),
  onBranchUpdate: branch => dispatch(branchUpdated(branch)),
  onActivityStart: () => dispatch(clearMessages()),
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
});

BranchDetailsView.propTypes = {
  branches: React.PropTypes.array,
  selectedBranch: React.PropTypes.object,
  onBranchUpdate: React.PropTypes.func,
  onBranchRemoved: React.PropTypes.func,
  onActivityStart: React.PropTypes.func,
  onActivityFailure: React.PropTypes.func,
  onActivitySuccess: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(BranchDetailsView);
