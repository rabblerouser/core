import React from 'react';

import Header from './header';
import UserMessageView from './UserMessageView';
import NetworkManagement from './networkManagement';
import BranchManagement from './branchManagement';
import { RestrictedTo } from './common';

const NetworkAdminDashboard = () => (
  <RestrictedTo type="SUPER">
    <div className="admin-container">
      <Header />
      <UserMessageView />
      <BranchManagement />
      <NetworkManagement />
    </div>
  </RestrictedTo>
);

export default NetworkAdminDashboard;
