import React from 'react';
import { connect } from 'react-redux';

import EditBranchForm from './EditBranchForm';
import { DeleteButton, AddButton, EditButton, Modal } from '../../common';
import { getSelectedBranch } from '../../reducers/branchReducers';
import { getIsEditActive } from './reducers';
import { addBranch, editBranch, branchRemoveRequested, finishEditBranch } from './actions';

export const BranchActions = ({ add, edit, remove, isModalOpen, handleCloseModal }) => (
  <span>
    <AddButton onClick={add} />
    <EditButton onClick={edit} />
    <DeleteButton
      confirmMessage="Are you sure you want to delete the current branch?"
      title="Delete branch"
      onDelete={remove}
    />
    <Modal isOpen={isModalOpen} handleClose={handleCloseModal} >
      <EditBranchForm />
    </Modal>
  </span>
);

const mapStateToProps = state => ({
  branch: getSelectedBranch(state),
  isModalOpen: getIsEditActive(state),
});

const mapDispatchToProps = {
  add: addBranch,
  edit: editBranch,
  remove: branchRemoveRequested,
  handleCloseModal: finishEditBranch,
};

const mergeProps = ({ branch, isModalOpen }, { add, edit, remove, handleCloseModal }) => ({
  add: () => add(),
  edit: () => edit(branch),
  remove: () => remove(branch),
  isModalOpen,
  handleCloseModal,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BranchActions);
