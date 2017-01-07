import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditAdminForm from './EditAdminForm';
import AdminListTable from './AdminListTable';
import { AddButton, Modal } from '../../common';
import {
  adminListRequested,
  createAdmin,
  finishEditAdmin,
} from './actions';
import { getSelectedBranchId } from '../../reducers/branchReducers';
import { getIsEditActive } from './reducers';

class AdminsView extends Component {

  componentWillReceiveProps({ branchId }) {
    if (branchId && branchId !== this.props.branchId) {
      this.props.adminListRequested();
    }
  }

  render() {
    return (
      <section className="admin-section" id="network-admin">
        <h3>
           Admins
          <AddButton onClick={this.props.createAdmin} />
        </h3>
        <Modal isOpen={this.props.isModalOpen} handleClose={this.props.handleCloseModal} >
          <EditAdminForm />
        </Modal>
        <AdminListTable />
      </section>
    );
  }
}

const mapDispatchToProps = ({
  adminListRequested,
  createAdmin,
  handleCloseModal: finishEditAdmin,
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  isModalOpen: getIsEditActive(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminsView);
