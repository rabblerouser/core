import React from 'react';

import Header from './header';
import UserMessageView from './UserMessageView';
import BranchManagement from './branchManagement';
import NetworkManagement from './networkManagement';

import { RestrictedTo } from './common';

const AdminDashboard = () => (
  <div>
    <Header />
    <UserMessageView />
    <BranchManagement />
    <RestrictedTo type="SUPER">
      <NetworkManagement />
    </RestrictedTo>
  </div>
);

export default AdminDashboard;
