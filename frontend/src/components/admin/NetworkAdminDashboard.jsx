import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  branchListUpdated,
 } from '../../actions/';

import AdminHeader from './AdminHeader.jsx';
import UserMessageView from './UserMessageView.jsx';
import BranchDetailsView from './branchView/BranchDetailsView.jsx';
import GroupsViewContainer from './groupView/GroupsViewContainer.jsx';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer.jsx';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer.jsx';
import branchService from '../../services/branchService.js';

class NetworkAdminDashboard extends Component {

  componentDidMount() {
    branchService.getMyBranches().then(branches => {
      this.props.onBranchListUpdate(branches);
    });
  }

  render() {
    return (
      <div className="admin-container">
        <AdminHeader />
        <UserMessageView />
        <BranchDetailsView />
        <OrganisersViewContainer />
        <GroupsViewContainer />
        <NetworkAdminsViewContainer />
      </div>);
  }
}

NetworkAdminDashboard.propTypes = {
  onBranchListUpdate: React.PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  onBranchListUpdate: branches => dispatch(branchListUpdated(branches)),
});

const mapStateToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminDashboard);
