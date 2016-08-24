import React from 'react';
import { connect } from 'react-redux';

import EditBranchForm from './EditBranchForm';
import Modal from 'react-modal';
import { getisEditActive } from '../../../reducers/branchReducers';
import * as branchActions from '../../../actions/branchActions';

export const BranchModal = ({ isOpen, finishEditBranch }) => (
  <Modal isOpen={isOpen} onRequestClose={finishEditBranch} style={{ content: { bottom: 'none' } }}>
    <EditBranchForm />
  </Modal>
);

BranchModal.propTypes = {
  isOpen: React.PropTypes.bool,
  finishEditBranch: React.PropTypes.func,
};

const mapStateToProps = state => ({ isOpen: getisEditActive(state) });

export default connect(mapStateToProps, branchActions)(BranchModal);
