import React, { Component } from 'react';
import EditBranchForm from './EditBranchForm';
import Modal from 'react-modal';

class EditBranchModalLauncher extends Component {
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
          <EditBranchForm
            title="Edit branch"
            onSave={this.props.onSave}
            branch={this.props.branch}
            onSuccess={this.closeEditForm}
          />
        </Modal>
      </button>
    );
  }
}

EditBranchModalLauncher.propTypes = {
  branch: React.PropTypes.object,
  onSave: React.PropTypes.func.isRequired,
};

export default EditBranchModalLauncher;
