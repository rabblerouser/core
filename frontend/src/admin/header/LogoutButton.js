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


/*

button.logout, a {
    width: auto;
    flex-grow: 1;
    color: white;
    font-size: 1.1em;
    text-align: center;
    padding: 0;
    margin: 0;
    background: none;
}

button.logout:hover, a:hover {
    text-decoration: underline;
}

button.logout {
    @include media($mobile) {
        text-align: left;
        padding-left: 2px;
        padding-top: 15px;
        margin: 0;
        color: #fff;
        margin-top: 2px;
        font-size: 1em;
    }
}


button.logout {
  background: none;
  border: none;
  padding: 0.3em;
  color: #062C40;
  border-radius: 0;
  font-weight: normal;
  font-size: 1.1em;
  min-width: 4em;
  margin-left: 1em;
  margin-right: 1em;
}

button.logout:hover {
  text-decoration:underline;
}
*/
