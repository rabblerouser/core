import React from 'react';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import GroupsView from '../groupView';
import MembersViewContainer from '../components/memberView/MembersViewContainer';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';

const AdminDashboard = () => (
  <div className="admin-container">
    <AdminHeader />
    <UserMessageView />
    <OrganisersViewContainer />
    <section>
      <GroupsView />
      <MembersViewContainer />
    </section>

  </div>
);

export default AdminDashboard;
