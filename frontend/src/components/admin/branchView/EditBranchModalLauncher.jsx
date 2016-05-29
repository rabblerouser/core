import React, { Component } from 'react';
import EditBranchForm from './EditBranchForm.jsx';
import Modal from 'react-modal';

export default class EditBranchModalLauncher extends Component {
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
      <button onClick={this.launchEditForm.bind(this)} className="edit" title="Edit details">
        <span>Edit details</span>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeEditForm.bind(this)} style={customStyle}>
          <EditBranchForm
            title="Edit branch"
            onSave={this.props.onSave}
            branch={this.props.branch}
            onSuccess={this.closeEditForm.bind(this)}
          />
        </Modal>
      </button>
    );
  }
}
