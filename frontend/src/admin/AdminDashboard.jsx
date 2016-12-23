import React from 'react';

import Header from './header/Header';
import UserMessageView from './UserMessageView';
import GroupsView from './groupView';
import MembersView from './memberView/';
import { OrganisersView } from './adminsView';

const AdminDashboard = () => (
  <div className="admin-container">
    <Header />
    <UserMessageView />
    <OrganisersView />
    <section>
      <GroupsView />
      <MembersView />
    </section>

  </div>
);

export default AdminDashboard;
