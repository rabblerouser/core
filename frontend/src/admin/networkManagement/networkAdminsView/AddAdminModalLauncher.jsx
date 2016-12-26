import React, { Component } from 'react';
import AddAdminForm from './AddAdminForm';
import Modal from 'react-modal';

class AddAdminModalLauncher extends Component {
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
      <button
        onClick={this.launchAddForm}
        className="new"
        title="New"
      >
        <span>New</span>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeAddForm}
          style={customStyle}
        >
          <AddAdminForm
            type={this.props.type}
            onSave={this.props.onSave}
            onSuccess={this.closeAddForm}
          />
        </Modal>
      </button>
    );
  }
}

AddAdminModalLauncher.propTypes = {
  type: React.PropTypes.string,
  onSave: React.PropTypes.func.isRequired,
};

export default AddAdminModalLauncher;
