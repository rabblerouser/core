import React from 'react';
import { connect } from 'react-redux';

import {
  getCanSelectBranch,
  getSelectedBranch,
 } from '../../reducers/branchReducers';

import BranchSelector from './BranchSelector.jsx';
import LogoutButton from './LogoutButton.jsx';
import OrganisationIcon from './OrganisationIcon.jsx';

const AdminHeader = ({ canSelectBranch, selectedBranch }) => (
  <header className="admin-header header">
    <OrganisationIcon />
    {canSelectBranch ? <BranchSelector /> : <span>{selectedBranch.name}</span>}
    <LogoutButton />
  </header>
);

AdminHeader.propTypes = {
  canSelectBranch: React.PropTypes.bool,
  selectedBranch: React.PropTypes.object,
};

const mapStateToProps = state => ({
  canSelectBranch: getCanSelectBranch(state),
  selectedBranch: getSelectedBranch(state),
});

export default connect(mapStateToProps)(AdminHeader);
