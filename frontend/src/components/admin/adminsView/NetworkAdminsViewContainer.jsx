import React, { Component } from 'react';
import { connect } from 'react-redux';

import AdminsView from './AdminsView.jsx';
import adminService from '../../../services/adminService.js';
import _ from 'underscore';

import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../../../actions/';

import {
  getSelectedBranchId,
} from '../../../reducers/branchReducers';


class NetworkAdminsViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      onSave: adminDetails => {
        this.props.onActivityStart();
        const saveAction = this.state.admins.find(admin => admin.id === adminDetails.id) === undefined ?
          adminService.createNetworkAdmin :
          adminService.updateNetworkAdmin;
        saveAction(adminDetails)
          .then(savedAdmin => {
            this.updateAdmins(this.state.admins, savedAdmin);
            this.props.onActivitySuccess('Network admin successfully saved');
          })
          .catch(this.props.onActivityFailure);
      },
      onDelete: selected => {
        this.props.onActivityStart();
        adminService.deleteNetworkAdmin(selected)
          .then(() => {
            this.setState({ admins: _.without(this.state.admins, selected) });
            this.props.onActivitySuccess('Network admin successfully deleted');
          })
          .catch(this.props.onActivityFailure);
      },
    };
  }

  componentDidMount() {
    adminService.getNetworkAdmins()
      .then(admins => this.setState({ admins }));
  }

  updateAdmins(collection, element) {
    const newElements = collection.slice(0);
    const oldElement = newElements.find(g => g.id === element.id);
    if (oldElement) {
      Object.assign(oldElement, element);
    } else {
      newElements.push(element);
    }
    this.setState({ admins: newElements });
  }

  render() {
    return (
      <AdminsView
        type={'Network Admin'}
        admins={this.state.admins}
        onSaveAdmin={this.state.onSave}
        onDeleteAdmin={this.state.onDelete}
      />
    );
  }
}

NetworkAdminsViewContainer.propTypes = {
  onActivityStart: React.PropTypes.func,
  onActivityFailure: React.PropTypes.func,
  onActivitySuccess: React.PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  onActivityStart: () => dispatch(clearMessages()),
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(NetworkAdminsViewContainer);
