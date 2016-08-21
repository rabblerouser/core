import React from 'react';
import { connect } from 'react-redux';

import EditBranchForm from './EditBranchForm';
import Modal from 'react-modal';
import { getIsModalOpen } from '../../../reducers/modalReducers';
import * as modalActions from '../../../actions/modalActions';

export const EditBranchModal = ({ isModalOpen, modalClosed, onSave, branch }) => (
  <Modal isOpen={isModalOpen} onRequestClose={modalClosed} style={{ content: { bottom: 'none' } }}>
    <EditBranchForm branch={branch} onSave={onSave} onSuccess={modalClosed} />
  </Modal>
);

EditBranchModal.propTypes = {
  isModalOpen: React.PropTypes.bool,
  modalClosed: React.PropTypes.func,
  onSave: React.PropTypes.func.isRequired,
  branch: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isModalOpen: getIsModalOpen(state, 'edit-branch'),
});

export default connect(mapStateToProps, modalActions)(EditBranchModal);
