import React from 'react';
import { connect } from 'react-redux';

import AddBranchForm from './AddBranchForm';
import Modal from 'react-modal';
import { getIsModalOpen } from '../../../reducers/modalReducers';
import * as modalActions from '../../../actions/modalActions';

export const AddBranchModal = ({ isModalOpen, modalClosed, onSave }) => (
  <Modal isOpen={isModalOpen} onRequestClose={modalClosed} style={{ content: { bottom: 'none' } }}>
    <AddBranchForm onSave={onSave} onSuccess={modalClosed} />
  </Modal>
);

AddBranchModal.propTypes = {
  isModalOpen: React.PropTypes.bool,
  modalClosed: React.PropTypes.func,
  onSave: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isModalOpen: getIsModalOpen(state, 'add-branch'),
});

export default connect(mapStateToProps, modalActions)(AddBranchModal);
