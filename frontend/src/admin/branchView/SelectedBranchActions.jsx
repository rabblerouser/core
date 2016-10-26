import React from 'react';
import { connect } from 'react-redux';

import BranchModal from './BranchModal';
import DeleteButton from '../common/DeleteButton';
import AddButton from '../common/AddButton';
import EditButton from '../common/EditButton';

import { getSelectedBranch } from '../reducers/branchReducers';
import * as branchActions from '../actions/branchActions';

export const SelectedBranchActions = ({ addBranch, editBranch, branchRemoveRequested, branch }) => (
  <span className="actions">
    <AddButton onClick={addBranch} />
    <EditButton onClick={editBranch} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current branch?"
      title="Delete branch"
      onDelete={() => branchRemoveRequested(branch)}
    />
    <BranchModal />
  </span>
);

const mapStateToProps = state => ({
  branch: getSelectedBranch(state),
});

SelectedBranchActions.propTypes = {
  branch: React.PropTypes.object,
  branchRemoveRequested: React.PropTypes.func,
  addBranch: React.PropTypes.func,
  editBranch: React.PropTypes.func,
};

export default connect(mapStateToProps, branchActions)(SelectedBranchActions);
