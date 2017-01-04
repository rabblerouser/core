import React from 'react';

import Header from './header/Header';
import UserMessageView from './UserMessageView';
import BranchManagement from './branchManagement';

const AdminDashboard = () => (
  <div className="admin-container">
    <Header />
    <UserMessageView />
    <BranchManagement />
  </div>
);

export default AdminDashboard;
