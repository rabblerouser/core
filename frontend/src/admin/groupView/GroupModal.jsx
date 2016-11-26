import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import EditGroupForm from './EditGroupForm';
import { getIsEditActive } from './reducers';
import { finishEditGroup } from './actions';

export const GroupModal = ({ isOpen, handleClose }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={handleClose}
    style={{ content: { bottom: 'none' } }}
  >
    <EditGroupForm />
  </Modal>
);

GroupModal.propTypes = {
  isOpen: React.PropTypes.bool,
  handleClose: React.PropTypes.func,
};

const mapStateToProps = state => ({ isOpen: getIsEditActive(state) });

export default connect(mapStateToProps, { handleClose: finishEditGroup })(GroupModal);
