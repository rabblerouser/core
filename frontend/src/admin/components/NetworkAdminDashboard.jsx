import React, { Component } from 'react';
import { connect } from 'react-redux';
import { branchListRequested } from '../actions/branchActions';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import BranchDetails from './branchView/BranchDetails';
import GroupsViewContainer from './groupView/GroupsViewContainer';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer';

class NetworkAdminDashboard extends Component {
  componentDidMount() {
    this.props.branchListRequested();
  }

  render() {
    return (
      <div className="admin-container">
        <AdminHeader />
        <UserMessageView />
        <BranchDetails />
        <OrganisersViewContainer />
        <GroupsViewContainer />
        <NetworkAdminsViewContainer />
      </div>);
  }
}

NetworkAdminDashboard.propTypes = {
  branchListRequested: React.PropTypes.func,
};

export default connect(() => ({}), { branchListRequested })(NetworkAdminDashboard);
