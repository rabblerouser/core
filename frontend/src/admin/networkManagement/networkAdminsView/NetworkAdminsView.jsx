import React, { Component } from 'react';
import { connect } from 'react-redux';

import AddAdminModalLauncher from './AddAdminModalLauncher';
import AdminListTable from './AdminListTable';
import {
  networkAdminListRequested,
  networkAdminRemoveRequested,
  networkAdminUpdateRequested,
  networkAdminCreateRequested,
} from './actions';
import { getNetworkAdmins, getSelectedNetworkAdmin } from './reducers';

class NetworkAdminsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onSave: adminDetails => (
        !!this.props.selectedNetworkAdmin ?
        this.props.requestAdminUpdate(adminDetails) :
        this.props.requestAdminCreate(adminDetails)
      ),
      onDelete: ({ id }) => this.props.requestAdminRemove(id),
    };
  }

  componentDidMount() {
    this.props.networkAdminListRequested();
  }

  render() {
    return (
      <section className="admin-section" id="network-admin">
        <h3>
          Network Admins
          <AddAdminModalLauncher type="Network Admin" onSave={this.state.onSave} />
        </h3>
        <AdminListTable
          admins={this.props.networkAdmins}
          onSaveAdmin={this.state.onSave}
          onDeleteAdmin={this.state.onDelete}
        />
        {this.props.networkAdmins.length === 0 &&
          <aside className="no-entries">No entries found</aside>
        }
      </section>
    );
  }
}

const mapDispatchToProps = ({
  networkAdminListRequested,
  requestAdminRemove: networkAdminRemoveRequested,
  requestAdminCreate: networkAdminCreateRequested,
  requestAdminUpdate: networkAdminUpdateRequested,
});

const mapStateToProps = state => ({
  selectedNetworkAdmin: getSelectedNetworkAdmin(state),
  networkAdmins: getNetworkAdmins(state),
});

NetworkAdminsView.propTypes = {
  selectedNetworkAdmin: React.PropTypes.object,
  networkAdmins: React.PropTypes.array,
  networkAdminListRequested: React.PropTypes.func,
  requestAdminRemove: React.PropTypes.func,
  requestAdminCreate: React.PropTypes.func,
  requestAdminUpdate: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminsView);
