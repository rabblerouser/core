import React from 'react';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import GroupsView from '../groupView';
import MembersView from '../memberView/';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';

const AdminDashboard = () => (
  <div className="admin-container">
    <AdminHeader />
    <UserMessageView />
    <OrganisersViewContainer />
    <section>
      <GroupsView />
      <MembersView />
    </section>

  </div>
);

export default AdminDashboard;
