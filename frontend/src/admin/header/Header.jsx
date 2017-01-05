import React from 'react';
import { connect } from 'react-redux';

import {
  getCanSelectBranch,
  getSelectedBranch,
 } from '../reducers/branchReducers';

import BranchSelectBox from './BranchSelectBox';
import LogoutButton from './LogoutButton';

const Header = ({ canSelectBranch, selectedBranch }) => (
  <header className="admin-header header">
    <img src="/images/rabble-rouser-logo.png" alt="Rabble Rouser" width="90px" />
    <span id="header-logo" alt="Logo" />
    {canSelectBranch
      ? <BranchSelectBox />
      : <span className="currentBranch">{selectedBranch.name}</span>
    }
    <LogoutButton />
  </header>
);

Header.propTypes = {
  canSelectBranch: React.PropTypes.bool,
  selectedBranch: React.PropTypes.object,
};

const mapStateToProps = state => ({
  canSelectBranch: getCanSelectBranch(state),
  selectedBranch: getSelectedBranch(state),
});

export default connect(mapStateToProps)(Header);
