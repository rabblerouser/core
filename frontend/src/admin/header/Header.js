import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  getCanSelectBranch,
  getSelectedBranch,
 } from '../reducers/branchReducers';

import BranchSelectBox from './BranchSelectBox';
import LogoutButton from './LogoutButton';

const StyledHeader = styled.header`
  background-color: ${props => props.theme.primaryColour};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 50px;
`;

const Header = ({ canSelectBranch, selectedBranch }) => (
  <StyledHeader>
    <img src="/images/rabble-rouser-logo.png" alt="Rabble Rouser" width="90px" />
    <span id="header-logo" alt="Logo" />
    {canSelectBranch
      ? <BranchSelectBox />
      : <span className="currentBranch">{selectedBranch.name}</span>
    }
    <LogoutButton />
  </StyledHeader>
);

const mapStateToProps = state => ({
  canSelectBranch: getCanSelectBranch(state),
  selectedBranch: getSelectedBranch(state),
});

export default connect(mapStateToProps)(Header);
