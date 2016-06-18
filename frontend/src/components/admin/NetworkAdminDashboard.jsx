import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'underscore';
import AdminHeader from './AdminHeader.jsx';
import UserMessageView from './UserMessageView.jsx';
import BranchDetailsView from './branchView/BranchDetailsView.jsx';
import GroupsViewContainer from './groupView/GroupsViewContainer.jsx';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer.jsx';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer.jsx';
import branchService from '../../services/branchService.js';
import { AdminDashboard as Strings } from '../../config/strings.js';

export default class NetworkAdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branches: [],
      selectedBranch: {},
      userMessages: [],
      pageErrors: [],
      onSelectBranch: id => {
        const selectedBranch = this.state.branches.find(branch => branch.id === id);
        this.updateBranchSelection(selectedBranch);
      },
      onSaveBranch: branchDetails => {
        this.clearMessages();
        const saveAction = this.state.branches.find(branch => branch.id === branchDetails.id) === undefined ?
          branchService.createBranch :
          branchService.updateBranch;
        saveAction(branchDetails, this.state.selectedBranch.id)
          .then(savedBranch => {
            this.updateBranches(this.state.branches, savedBranch);
            this.setUserMessage('Branches successfully saved');
          })
          .catch(this.handleError.bind(this));
      },
      onDeleteBranch: selected => {
        this.clearMessages();
        branchService.deleteBranch(selected, this.state.selectedBranch.id)
          .then(() => {
            this.removeAndUpdateBranches(this.state.branches, selected);
            this.updateBranchSelection(this.state.branches[0]);
            this.setUserMessage('Branch successfully deleted');
          })
          .catch(this.handleError.bind(this));
      },
    };
    this.clearMessages = this.clearMessages.bind(this);
    this.handleError = this.handleError.bind(this);
    this.setUserMessage = this.setUserMessage.bind(this);
  }

  componentDidMount() {
    branchService.getMyBranches()
      .then(branches => {
        this.setState({ branches });
        this.updateBranchSelection(branches[0]);
      });
  }

  setUserMessage(message) {
    const userMessages = this.state.userMessages.slice(0);
    userMessages.push(message);
    this.setState({ userMessages });
  }

  clearMessages() {
    this.setState({ userMessages: [] });
    this.setState({ pageErrors: [] });
  }

  handleError() {
    const pageErrors = this.state.pageErrors.slice(0);
    pageErrors.push(Strings.RemoteSaveErrorMessage);
    this.setState({ pageErrors });
  }

  updateBranches(branches, savedBranch) {
    const newBranches = branches.slice(0);
    const oldBranch = newBranches.find(branch => branch.id === savedBranch.id);
    if (oldBranch) {
      Object.assign(oldBranch, savedBranch);
    } else {
      newBranches.push(savedBranch);
    }
    this.setState({ branches: newBranches });
  }

  removeAndUpdateBranches(collection, element) {
    this.removeAndUpdate('branches', collection, element);
  }

  removeAndUpdate(collectionName, collection, element) {
    const oldElement = collection.find(item => item.id === element.id);
    const state = {};
    state[collectionName] = _.without(collection, oldElement);
    this.setState(state);
  }

  updateBranchSelection(branch) {
    this.setState({ selectedBranch: branch });
  }

  render() {
    return (
      <div className="admin-container">
        <AdminHeader
          selectedBranch={this.state.selectedBranch}
          branches={this.state.branches}
          onSelectBranch={this.state.onSelectBranch}
        />
        <UserMessageView
          messages={this.state.userMessages}
          errors={this.state.pageErrors}
        />
        <BranchDetailsView
          selectedBranch={this.state.selectedBranch}
          onSaveBranch={this.state.onSaveBranch}
          onDeleteBranch={this.state.onDeleteBranch}
        />
        <OrganisersViewContainer
          branchId={this.state.selectedBranch.id}
          onPreAction={this.clearMessages}
          onActionError={this.handleError}
          onActionSuccess={this.setUserMessage}
        />
        <GroupsViewContainer
          branchId={this.state.selectedBranch.id}
          onPreAction={this.clearMessages}
          onActionError={this.handleError}
          onActionSuccess={this.setUserMessage}
        />
        <NetworkAdminsViewContainer
          onPreAction={this.clearMessages}
          onActionError={this.handleError}
          onActionSuccess={this.setUserMessage}
        />
      </div>);
  }
}

render(<NetworkAdminDashboard />, document.getElementById('app'));
