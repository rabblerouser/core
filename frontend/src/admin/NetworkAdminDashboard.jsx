import React from 'react';

import Header from './header/Header';
import UserMessageView from './UserMessageView';
import BranchDetails from './branchView';
import { OrganisersView, NetworkAdminsView } from './adminsView';
import GroupsView from './groupView';
import MembersView from './memberView';

const BranchManagement = () => (
  <section>
    <BranchDetails />
    <OrganisersView />
    <section>
      <GroupsView />
      <MembersView />
    </section>
  </section>
);

const NetworkManagement = () => (
  <section>
    <NetworkAdminsView />
  </section>
);

const NetworkAdminDashboard = () => (
  <div className="admin-container">
    <Header />
    <UserMessageView />
    <BranchManagement />
    <NetworkManagement />
  </div>
);

export default NetworkAdminDashboard;
