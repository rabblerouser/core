import React, { Component } from 'react';
import AddLabForm from './AddLabForm.jsx';
import Modal from 'react-modal';

export default class AddLabModalLauncher extends Component {
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
      <button onClick={this.launchAddForm.bind(this)} className="new" title="New lab">
        <span>New lab</span>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeAddForm.bind(this)} style={customStyle}>
          <AddLabForm onSave={this.props.onSave} onSuccess={this.closeAddForm.bind(this)} />
        </Modal>
      </button>
    );
  }
}
