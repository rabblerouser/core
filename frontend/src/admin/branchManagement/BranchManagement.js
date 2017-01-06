import React from 'react';
import { connect } from 'react-redux';
import BranchDetails from './branchView';
import AdminsView from './adminsView';
import GroupsView from './groupView';
import MembersView from './memberView';

const BranchManagement = () => (
  <section>
    <BranchDetails />
    <AdminsView />
    <section>
      <GroupsView />
      <MembersView />
    </section>
  </section>
);

export default connect(() => ({}))(BranchManagement);
