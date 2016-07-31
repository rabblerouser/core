import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../actions/';

const LogoutButton = ({ onLogout }) => (
  <button onClick={onLogout} className="logout">Logout</button>
);

LogoutButton.propTypes = {
  onLogout: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onLogout: () => dispatch(logout()),
});

export default connect(() => ({}), mapDispatchToProps)(LogoutButton);
