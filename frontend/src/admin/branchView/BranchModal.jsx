import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import EditBranchForm from './EditBranchForm';
import { getIsEditActive } from './reducers';
import { finishEditBranch } from './actions';

export const BranchModal = ({ isOpen, handleClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={handleClose}
    style={{ content: { bottom: 'none' } }}
  >
    <EditBranchForm />
  </Modal>
);

BranchModal.propTypes = {
  isOpen: React.PropTypes.bool,
  handleClose: React.PropTypes.func,
};

const mapStateToProps = state => ({ isOpen: getIsEditActive(state) });

export default connect(mapStateToProps, { handleClose: finishEditBranch })(BranchModal);
