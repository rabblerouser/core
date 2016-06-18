import React, { Component } from 'react';
import { render } from 'react-dom';
import AdminHeader from './AdminHeader.jsx';
import UserMessageView from './UserMessageView.jsx';
import GroupsViewContainer from './groupView/GroupsViewContainer.jsx';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer.jsx';
import branchService from '../../services/branchService.js';
import { AdminDashboard as Strings } from '../../config/strings.js';

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branches: [],
      selectedBranch: {},
      userMessages: [],
      pageErrors: [],
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

  updateBranchSelection(branch) {
    this.setState({ selectedBranch: branch });
  }

  render() {
    return (
      <div className="admin-container">
        <AdminHeader selectedBranch={this.state.selectedBranch} branches={this.state.branches} />
        <UserMessageView
          messages={this.state.userMessages}
          errors={this.state.pageErrors}
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
      </div>);
  }
}

render(<AdminDashboard />, document.getElementById('app'));
