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

export default ModalWrapper;
