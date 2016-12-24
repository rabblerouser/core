import React from 'react';

import Header from './header/Header';
import UserMessageView from './UserMessageView';
import GroupsView from './groupView';
import MembersView from './memberView/';
import AdminsView from './adminsView';

const AdminDashboard = () => (
  <div className="admin-container">
    <Header />
    <UserMessageView />
    <AdminsView />
    <section>
      <GroupsView />
      <MembersView />
    </section>

  </div>
);

export default AdminDashboard;
