import React from 'react';

import Header from './header';
import UserMessageView from './UserMessageView';
import NetworkManagement from './networkManagement';
import BranchManagement from './branchManagement';

const NetworkAdminDashboard = () => (
  <div className="admin-container">
    <Header />
    <UserMessageView />
    <BranchManagement />
    <NetworkManagement />
  </div>
);

export default NetworkAdminDashboard;
