import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddAdminModalLauncher from './AddAdminModalLauncher';
import AdminListTable from './AdminListTable';
import {
  adminListRequested,
  adminRemoveRequested,
  adminUpdateRequested,
  adminCreateRequested,
} from './actions';
import { getAdmins, getSelectedAdmin } from './reducers';
import { getSelectedBranchId } from '../reducers/branchReducers';

class AdminsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onSave: adminDetails => (
        !!this.props.selectedAdmin ?
        this.props.requestAdminUpdate(adminDetails) :
        this.props.requestAdminCreate(adminDetails)
      ),
      onDelete: ({ id }) => this.props.requestAdminRemove(id),
    };
  }

  componentWillReceiveProps({ branchId }) {
    if (branchId && branchId !== this.props.branchId) {
      this.props.requestAdminList();
    }
  }

  render() {
    return (
      <section className="admin-section" id="organisers">
        <h3>
          Organisers
          <AddAdminModalLauncher type="Organiser" onSave={this.state.onSave} />
        </h3>
        <AdminListTable
          admins={this.props.admins}
          onSaveAdmin={this.state.onSave}
          onDeleteAdmin={this.state.onDelete}
        />
        {this.props.admins.length === 0 &&
          <aside className="no-entries">No entries found</aside>
        }
      </section>
    );
  }
}

const mapDispatchToProps = ({
  requestAdminList: adminListRequested,
  requestAdminRemove: adminRemoveRequested,
  requestAdminCreate: adminCreateRequested,
  requestAdminUpdate: adminUpdateRequested,
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  selectedAdmin: getSelectedAdmin(state),
  admins: getAdmins(state),
});

AdminsView.propTypes = {
  branchId: React.PropTypes.string,
  selectedAdmin: React.PropTypes.object,
  admins: React.PropTypes.array,
  requestAdminList: React.PropTypes.func,
  requestAdminRemove: React.PropTypes.func,
  requestAdminCreate: React.PropTypes.func,
  requestAdminUpdate: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminsView);
