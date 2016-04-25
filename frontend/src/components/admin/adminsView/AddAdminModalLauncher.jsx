import React, { Component } from 'react';
import AddAdminForm from './AddAdminForm.jsx';
import Modal from 'react-modal';

export default class AddAdminModalLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
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
        onClick={this.launchAddForm.bind(this)}
        className="new"
        title="New"
      >
        <span>New</span>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeAddForm.bind(this)}
          style={customStyle}
        >
          <AddAdminForm
            type={this.props.type}
            onSave={this.props.onSave}
            onSuccess={this.closeAddForm.bind(this)}
          />
        </Modal>
      </button>
    );
  }
}
