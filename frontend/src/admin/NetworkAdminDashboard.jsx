import React from 'react';

import Header from './header/Header';
import UserMessageView from './UserMessageView';
import BranchDetails from './branchView';
import AdminsView from './adminsView';
import NetworkManagement from './networkManagement';
import GroupsView from './groupView';
import MembersView from './memberView';

const BranchManagement = () => (
  <section>
    <BranchDetails />
    <AdminsView />
    <section>
      <GroupsView />
      <MembersView />
    </section>
  </section>
);

const NetworkAdminDashboard = () => (
  <div className="admin-container">
    <Header />
    <UserMessageView />
    <BranchManagement />
    <NetworkManagement />
      {
        customisation.adminStylesheets.map(stylesheet => (
          <link rel="stylesheet" href={stylesheet} key={stylesheet} />
        ))
      }
  </div>
);

export default NetworkAdminDashboard;
