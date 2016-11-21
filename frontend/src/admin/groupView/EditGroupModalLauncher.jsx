import React, { Component } from 'react';
import EditGroupForm from './EditGroupForm';
import Modal from 'react-modal';

export default class EditGroupModalLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.launchEditForm = this.launchEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
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
      <button onClick={this.launchEditForm} className="edit" title="Edit details">
        <span>Edit details</span>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeEditForm} style={customStyle}>
          <EditGroupForm
            title="Edit group"
            onSave={this.props.onSave}
            group={this.props.group}
            onSuccess={this.closeEditForm}
          />
        </Modal>
      </button>
    );
  }
}

EditGroupModalLauncher.propTypes = {
  group: React.PropTypes.object,
  onSave: React.PropTypes.func,
};
