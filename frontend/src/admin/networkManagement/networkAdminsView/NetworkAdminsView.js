import React, { Component } from 'react';
import { connect } from 'react-redux';

import EditNetworkAdminForm from './EditNetworkAdminForm';
import NetworkAdminListTable from './NetworkAdminListTable';
import { AddButton, Modal } from '../../common';
import {
  networkAdminListRequested,
  createNetworkAdmin,
  finishEditNetworkAdmin,
} from './actions';
import { getIsEditActive } from './reducers';


class NetworkAdminsView extends Component {

  componentDidMount() {
    this.props.networkAdminListRequested();
  }

  render() {
    return (
      <section className="admin-section" id="network-admin">
        <h3>
          Network Admins
          <AddButton onClick={this.props.createNetworkAdmin} />
        </h3>
        <Modal isOpen={this.props.isModalOpen} handleClose={this.props.handleCloseModal} >
          <EditNetworkAdminForm />
        </Modal>
        <NetworkAdminListTable />
      </section>
    );
  }
}

const mapDispatchToProps = ({
  networkAdminListRequested,
  createNetworkAdmin,
  handleCloseModal: finishEditNetworkAdmin,
});

const mapStateToProps = state => ({
  isModalOpen: getIsEditActive(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminsView);
