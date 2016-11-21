import React from 'react';

import AdminHeader from './AdminHeader';
import UserMessageView from './UserMessageView';
import GroupsViewContainer from '../groupView/';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer';

const AdminDashboard = () => (
  <div className="admin-container">
    <AdminHeader />
    <UserMessageView />
    <OrganisersViewContainer />
    <GroupsViewContainer />
  </div>
);

export default AdminDashboard;
