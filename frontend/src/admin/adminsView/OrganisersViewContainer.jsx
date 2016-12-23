import React, { Component } from 'react';
import { connect } from 'react-redux';

import AdminsView from './AdminsView';
import branchService from '../services/branchService.js';
import adminService from '../services/adminService.js';

import {
  clearMessages,
  reportFailure,
  reportSuccess,
} from '../actions/';

import {
  getSelectedBranchId,
} from '../reducers/branchReducers';

import _ from 'lodash';

class OrganiserViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: [],
      onSave: adminDetails => {
        this.props.onActivityStart();
        const saveAction = this.state.admins.find(admin => admin.id === adminDetails.id) === undefined ?
          adminService.create :
          adminService.update;
        saveAction(adminDetails, this.props.branchId)
          .then(savedAdmin => {
            this.updateAdmins(this.state.admins, savedAdmin);
            this.props.onActivitySuccess('Organiser successfully saved');
          })
          .catch(this.props.onActivityFailure);
      },
      onDelete: selected => {
        this.props.onActivityStart();
        adminService.delete(selected, this.props.branchId)
          .then(() => {
            this.removeAndUpdate(this.state.admins, selected);
            this.props.onActivitySuccess('Organiser successfully deleted');
          })
          .catch(this.props.onActivityFailure);
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.branchId && nextProps.branchId !== this.props.branchId) {
      branchService.getBranchAdmins(nextProps.branchId)
        .then(admins => {
          this.setState({ admins });
        });
    }
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

  removeAndUpdate(collection, element) {
    const oldElement = collection.find(item => item.id === element.id);
    this.setState({ admins: _.without(collection, oldElement) });
  }

  render() {
    return (
      <AdminsView
        type={'Organiser'}
        id="organisers"
        admins={this.state.admins}
        onSaveAdmin={this.state.onSave}
        onDeleteAdmin={this.state.onDelete}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onActivityStart: () => dispatch(clearMessages()),
  onActivityFailure: error => dispatch(reportFailure(error)),
  onActivitySuccess: success => dispatch(reportSuccess(success)),
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
});

OrganiserViewContainer.propTypes = {
  onPreAction: React.PropTypes.func,
  onActivityStart: React.PropTypes.func,
  onActivityFailure: React.PropTypes.func,
  onActivitySuccess: React.PropTypes.func,
  branchId: React.PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganiserViewContainer);
