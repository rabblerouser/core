import React, { Component } from 'react';
import { connect } from 'react-redux';

import NetworkAdminsView, { networkAdminListRequested } from './networkAdminsView';

class NetworkManagement extends Component {

  componentDidMount() {
    this.props.networkAdminListRequested();
  }

  render() {
    return (
      <section>
        <NetworkAdminsView />
      </section>
    );
  }
}

export default connect(() => ({}), { networkAdminListRequested })(NetworkManagement);
