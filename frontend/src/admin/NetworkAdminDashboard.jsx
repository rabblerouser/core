import React from 'react';

import Header from './header/Header';
import UserMessageView from './UserMessageView';
import NetworkManagement from './networkManagement';
import BranchManagement from './branchManagement';

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
