import React from 'react';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import BranchDetails from '../branchView/';
import GroupsViewContainer from './groupView/GroupsViewContainer';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer';

const NetworkAdminDashboard = () => (
  <div className="admin-container">
    <AdminHeader />
    <UserMessageView />
    <BranchDetails />
    <OrganisersViewContainer />
    <GroupsViewContainer />
    <NetworkAdminsViewContainer />
  </div>
);

export default NetworkAdminDashboard;
