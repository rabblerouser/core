import React from 'react';

import Header from './header';
import UserMessageView from './UserMessageView';
import BranchManagement from './branchManagement';
import { RestrictedTo } from './common';

const AdminDashboard = () => (
  <RestrictedTo type="BRANCH">
    <div className="admin-container">
      <Header />
      <UserMessageView />
      <BranchManagement />
    </div>
  </RestrictedTo>

);

export default AdminDashboard;
