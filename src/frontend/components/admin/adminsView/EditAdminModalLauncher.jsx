import React, { Component } from 'react';

import EditAdminForm from './EditAdminForm.jsx';
import Modal from 'react-modal';

export default class EditAdminModalLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
  }

  launchEditForm() {
    this.setState({ modalIsOpen: true });
  }

  closeEditForm() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const customStyle = { content: { bottom: 'none' } };
    return (
      <div className="buttons">
        <button className="edit" onClick={this.launchEditForm.bind(this)}><span>Edit admin</span></button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeEditForm.bind(this)} style={customStyle}
        >
          <EditAdminForm
            admin={this.props.admin}
            onSave={this.props.onSave}
            onSuccess={this.closeEditForm.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}
