import React, { Component } from 'react';
import { connect } from 'react-redux';

import AdminsView from './AdminsView';
import adminService from '../services/adminService.js';

import { adminListRequested, adminRemoveRequested } from './actions';
import { getAdmins } from './reducers';
import { getSelectedBranchId } from '../reducers/branchReducers';

class OrganiserViewContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      admins: this.props.admins,
      onSave: adminDetails => {
        const saveAction = this.state.admins.find(admin => admin.id === adminDetails.id) === undefined ?
          adminService.create :
          adminService.update;
        saveAction(adminDetails, this.props.branchId)
          .then(savedAdmin => {
            this.updateAdmins(this.state.admins, savedAdmin);
          });
      },
      onDelete: ({ id }) => this.props.requestAdminRemove(id),
    };
  }

  componentWillReceiveProps({ branchId }) {
    if (branchId && branchId !== this.props.branchId) {
      this.props.requestAdminList();
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

  render() {
    return (
      <AdminsView
        type={'Organiser'}
        id="organisers"
        admins={this.props.admins}
        onSaveAdmin={this.state.onSave}
        onDeleteAdmin={this.state.onDelete}
      />
    );
  }
}

const mapDispatchToProps = ({
  requestAdminList: adminListRequested,
  requestAdminRemove: adminRemoveRequested,
});

const mapStateToProps = state => ({
  branchId: getSelectedBranchId(state),
  admins: getAdmins(state),
});

OrganiserViewContainer.propTypes = {
  branchId: React.PropTypes.string,
  admins: React.PropTypes.array,
  requestAdminList: React.PropTypes.func,
  requestAdminRemove: React.PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganiserViewContainer);
