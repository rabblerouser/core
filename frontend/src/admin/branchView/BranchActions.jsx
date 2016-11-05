import React from 'react';
import { connect } from 'react-redux';

import BranchModal from './BranchModal';
import DeleteButton from '../common/DeleteButton';
import AddButton from '../common/AddButton';
import EditButton from '../common/EditButton';

import { getSelectedBranch } from './reducers';
import { addBranch, editBranch, branchRemoveRequested } from './actions';

export const BranchActions = ({ add, edit, remove }) => (
  <span className="actions">
    <AddButton onClick={add} />
    <EditButton onClick={edit} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current branch?"
      title="Delete branch"
      onDelete={remove}
    />
    <BranchModal />
  </span>
);

const mapStateToProps = state => ({
  branch: getSelectedBranch(state),
});

const mapDispatchToProps = {
  add: addBranch,
  edit: editBranch,
  remove: branchRemoveRequested,
};

const mergeProps = ({ branch }, { add, edit, remove }) => ({
  add: () => add(),
  edit: () => edit(branch),
  remove: () => remove(branch),
});

BranchActions.propTypes = {
  branch: React.PropTypes.object,
  remove: React.PropTypes.func,
  add: React.PropTypes.func,
  edit: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BranchActions);
