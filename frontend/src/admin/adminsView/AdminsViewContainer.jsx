import React, { Component } from 'react';
import { connect } from 'react-redux';

import AdminsView from './AdminsView';
import {
  adminListRequested,
  adminRemoveRequested,
  adminUpdateRequested,
  adminCreateRequested,
} from './actions';
import { getAdmins, getSelectedAdmin } from './reducers';
import { getSelectedBranchId } from '../reducers/branchReducers';

class AdminViewContainer extends Component {
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
      <AdminsView
        type={'Organiser'}
        id="organisers"
        admins={this.props.admins}
        onSaveAdmin={this.state.onSave}
        onDeleteAdmin={this.state.onDelete}
      />
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

AdminViewContainer.propTypes = {
  branchId: React.PropTypes.string,
  selectedAdmin: React.PropTypes.object,
  admins: React.PropTypes.array,
  requestAdminList: React.PropTypes.func,
  requestAdminRemove: React.PropTypes.func,
  requestAdminCreate: React.PropTypes.func,
  requestAdminUpdate: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminViewContainer);
