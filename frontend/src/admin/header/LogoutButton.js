import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../actions/';
import { Button } from '../common';

const StyledLogoutButton = styled(Button)`
  background-color: ${props => props.theme.primaryColour};
  color: white;
  border: 1px solid white;
  border-radius: 4px;
  font-size: 20px;
`;

const LogoutButton = ({ onLogout }) => (
  <StyledLogoutButton onClick={onLogout} className="logout">Logout</StyledLogoutButton>
);

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
});

export default connect(() => ({}), mapDispatchToProps)(LogoutButton);
