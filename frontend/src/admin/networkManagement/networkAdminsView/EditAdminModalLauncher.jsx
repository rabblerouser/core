import React, { Component } from 'react';
import { connect } from 'react-redux';
import EditAdminForm from './EditAdminForm';
import Modal from 'react-modal';

import {
  editAdmin,
  finishEditAdmin,
} from './actions';

class EditAdminModalLauncher extends Component {
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
    this.launchEditForm = this.launchEditForm.bind(this);
    this.closeEditForm = this.closeEditForm.bind(this);
  }

  launchEditForm() {
    this.props.editAdmin(this.props.admin.id);
    this.setState({ modalIsOpen: true });
  }

  closeEditForm() {
    this.props.finishEditAdmin();
    this.setState({ modalIsOpen: false });
  }

  render() {
    const customStyle = { content: { bottom: 'none' } };

    return (
      <div className="buttons">
        <button className="edit" onClick={this.launchEditForm}><span>Edit admin</span></button>
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeEditForm} style={customStyle}>
          <EditAdminForm
            admin={this.props.admin}
            onSave={this.props.onSave}
            onSuccess={this.closeEditForm}
          />
        </Modal>
      </div>
    );
  }
}

EditAdminModalLauncher.propTypes = {
  admin: React.PropTypes.object.isRequired,
  onSave: React.PropTypes.func.isRequired,
  editAdmin: React.PropTypes.func.isRequired,
  finishEditAdmin: React.PropTypes.func.isRequired,
};

export default connect(() => ({}), { editAdmin, finishEditAdmin })(EditAdminModalLauncher);
