import React from 'react';
import Modal from 'react-modal';

export const ModalWrapper = ({ isOpen, handleClose, children }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={handleClose}
    style={{ content: { bottom: 'none' } }}
  >
    {children}
  </Modal>
);

ModalWrapper.propTypes = {
  isOpen: React.PropTypes.bool,
  handleClose: React.PropTypes.func,
  children: React.PropTypes.any,
};

export default ModalWrapper;
