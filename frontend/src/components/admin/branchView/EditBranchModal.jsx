import React from 'react';
import { connect } from 'react-redux';

import EditBranchForm from './EditBranchForm';
import Modal from 'react-modal';
import { getIsModalOpen } from '../../../reducers/modalReducers';
import * as modalActions from '../../../actions/modalActions';

export const EditBranchModal = ({ isModalOpen, modalClosed, branch }) => (
  <Modal isOpen={isModalOpen} onRequestClose={modalClosed} style={{ content: { bottom: 'none' } }}>
    <EditBranchForm branch={branch} />
  </Modal>
);

EditBranchModal.propTypes = {
  isModalOpen: React.PropTypes.bool,
  modalClosed: React.PropTypes.func,
  branch: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isModalOpen: getIsModalOpen(state, 'edit-branch'),
});

export default connect(mapStateToProps, modalActions)(EditBranchModal);
