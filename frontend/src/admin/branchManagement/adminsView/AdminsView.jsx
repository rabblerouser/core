import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditAdminForm from './EditAdminForm';
import AdminListTable from './AdminListTable';
import { AddButton, Modal } from '../../common';
import {
  adminListRequested,
  createAdmin,
} from './actions';
import { getSelectedBranchId } from '../../reducers/branchReducers';
import { getIsEditActive, finishEditAdmin } from './reducers';

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
        <Modal isOpen={this.props.isModalOpen} handleClose={finishEditAdmin} >
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
  finishEditAdmin,
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  isModalOpen: getIsEditActive(state),
});

AdminsView.propTypes = {
  branchId: React.PropTypes.string,
  adminListRequested: React.PropTypes.func,
  isModalOpen: React.PropTypes.bool,
  createAdmin: React.PropTypes.func,
  finishEditAdmin: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminsView);
