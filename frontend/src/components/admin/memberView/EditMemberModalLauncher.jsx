import React, { Component } from 'react';
import EditMemberForm from './EditMemberForm';
import Modal from 'react-modal';

export default class EditMemberModalLauncher extends Component {
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
      <div className="buttons">
        <button className="edit" onClick={this.launchEditForm}><span>Edit groups</span></button>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeEditForm} style={customStyle}>
          <EditMemberForm
            member={this.props.member}
            onSave={this.props.onSave}
            onSuccess={this.closeEditForm}
          />
        </Modal>
      </div>
    );
  }
}

EditMemberModalLauncher.propTypes = {
  member: React.PropTypes.object,
  onSave: React.PropTypes.func,
};
