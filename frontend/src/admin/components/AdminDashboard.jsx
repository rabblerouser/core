import React from 'react';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import GroupsView from '../groupView';
import MembersView from '../memberView/';
import { OrganisersView } from '../adminsView';

const AdminDashboard = () => (
  <div className="admin-container">
    <AdminHeader />
    <UserMessageView />
    <OrganisersView />
    <section>
      <GroupsView />
      <MembersView />
    </section>

  </div>
);

export default AdminDashboard;
