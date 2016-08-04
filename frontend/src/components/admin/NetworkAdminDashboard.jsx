import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  branchListUpdated,
 } from '../../actions/';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import BranchDetailsView from './branchView/BranchDetailsView';
import GroupsViewContainer from './groupView/GroupsViewContainer';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer';
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
