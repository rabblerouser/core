import React, { Component } from 'react';
import EditGroupForm from './EditGroupForm';
import Modal from 'react-modal';

class AddGroupModalLauncher extends Component {
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
      <button onClick={this.launchEditForm} className="new" title="New group">
        <span>New group</span>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeEditForm} style={customStyle}>
          <EditGroupForm
            title="New group"
            onSave={this.props.onSave}
            group={{}}
            onSuccess={this.closeEditForm}
          />
        </Modal>
      </button>
    );
  }
}

AddGroupModalLauncher.propTypes = {
  onSave: React.PropTypes.func,
};

export default AddGroupModalLauncher;
