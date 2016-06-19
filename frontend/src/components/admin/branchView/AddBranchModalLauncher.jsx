import React, { Component } from 'react';
import AddBranchForm from './AddBranchForm.jsx';
import Modal from 'react-modal';

class AddBranchModalLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.launchAddForm = this.launchAddForm.bind(this);
    this.closeAddForm = this.closeAddForm.bind(this);
  }

  launchAddForm() {
    this.setState({ modalIsOpen: true });
  }

  closeAddForm() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const customStyle = { content: { bottom: 'none' } };
    return (
      <button onClick={this.launchAddForm} className="new" title="New branch">
        <span>New branch</span>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeAddForm} style={customStyle}>
          <AddBranchForm onSave={this.props.onSave} onSuccess={this.closeAddForm} />
        </Modal>
      </button>
    );
  }
}

AddBranchModalLauncher.propTypes = {
  onSave: React.PropTypes.func.isRequired,
};

export default AddBranchModalLauncher;
