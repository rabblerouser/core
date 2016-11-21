import React from 'react';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import BranchDetails from '../branchView/';
import GroupsViewContainer from '../groupView/';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer';

const BranchManagement = () => (
  <section>
    <BranchDetails />
    <OrganisersViewContainer />
    <GroupsViewContainer />
  </section>
);

const NetworkManagement = () => (
  <section>
    <NetworkAdminsViewContainer />
  </section>
);

const NetworkAdminDashboard = () => (
  <div className="admin-container">
    <AdminHeader />
    <UserMessageView />
    <BranchManagement />
    <NetworkManagement />
  </div>
);

export default NetworkAdminDashboard;
