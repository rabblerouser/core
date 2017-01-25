import React from 'react';
import { connect } from 'react-redux';
import { SpacedLayout } from 'layabout';
import styled from 'styled-components';
import {
  getCanSelectBranch,
  getSelectedBranch,
 } from '../reducers/branchReducers';

import BranchSelectBox from './BranchSelectBox';
import LogoutButton from './LogoutButton';

const StyledHeader = styled.header`
  background-color: ${props => props.theme.primaryColour};
  justify-content: space-between;
  height: 60px;
  padding: 0 30px;
`;

const Header = ({ canSelectBranch, selectedBranch }) => (
  <SpacedLayout container={StyledHeader}>
    <img height="40px" src="/images/rabble-rouser-logo.png" alt="Rabble Rouser Logo" />
    {canSelectBranch
      ? <BranchSelectBox style={{ width: '200px' }} />
      : <span className="currentBranch">{selectedBranch.name}</span>
    }
    <LogoutButton />
  </SpacedLayout>
);

const mapStateToProps = state => ({
  canSelectBranch: getCanSelectBranch(state),
  selectedBranch: getSelectedBranch(state),
});

export default connect(mapStateToProps)(Header);
