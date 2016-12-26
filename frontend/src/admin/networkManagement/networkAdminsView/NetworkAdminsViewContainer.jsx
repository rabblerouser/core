import React, { Component } from 'react';
import { connect } from 'react-redux';

import AdminsView from './AdminsView';
import {
  networkAdminListRequested,
  networkAdminRemoveRequested,
  networkAdminUpdateRequested,
  networkAdminCreateRequested,
} from './actions';
import { getNetworkAdmins, getSelectedNetworkAdmin } from './reducers';

class NetworkAdminsViewContainer extends Component {
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
      <AdminsView
        type={'Network Admin'}
        id="organisers"
        admins={this.props.networkAdmins}
        onSaveAdmin={this.state.onSave}
        onDeleteAdmin={this.state.onDelete}
      />
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

NetworkAdminsViewContainer.propTypes = {
  selectedNetworkAdmin: React.PropTypes.object,
  networkAdmins: React.PropTypes.array,
  networkAdminListRequested: React.PropTypes.func,
  requestAdminRemove: React.PropTypes.func,
  requestAdminCreate: React.PropTypes.func,
  requestAdminUpdate: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminsViewContainer);
