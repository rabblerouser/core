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
      labs: [],
      selectedLab: {},
      userMessages: [],
      pageErrors: [],
    };
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

  setUserMessage(message) {
    const userMessages = this.state.userMessages.slice(0);
    userMessages.push(message);
    this.setState({ userMessages });
  }

  updateLabs(collection, element) {
    this.updateElements('labs', collection, element);
  }

  updateElements(collectionName, collection, element) {
    const newElements = collection.slice(0);
    const oldElement = newElements.find(g => g.id === element.id);
    if (oldElement) {
      Object.assign(oldElement, element);
    } else {
      newElements.push(element);
    }
    const state = {};
    state[collectionName] = newElements;
    this.setState(state);
  }

  removeAndUpdateLabs(collection, element) {
    this.removeAndUpdate('labs', collection, element);
  }

  componentDidMount() {
    branchService.getMyBranches()
      .then(labs => {
        this.setState({ labs });
        this.updateLabSelection(labs[0]);
      });
  }

  updateLabSelection(lab) {
    this.setState({ selectedLab: lab });
  }

  render() {
    return (
      <div className="admin-container">
        <AdminHeader selectedLab={this.state.selectedLab} labs={this.state.labs} />
        <UserMessageView
          messages={this.state.userMessages}
          errors={this.state.pageErrors}
        />
        <OrganisersViewContainer
          labId={this.state.selectedLab.id}
          onPreAction={this.clearMessages.bind(this)}
          onActionError={this.handleError.bind(this)}
          onActionSuccess={this.setUserMessage.bind(this)}
        />
        <GroupsViewContainer
          labId={this.state.selectedLab.id}
          onPreAction={this.clearMessages.bind(this)}
          onActionError={this.handleError.bind(this)}
          onActionSuccess={this.setUserMessage.bind(this)}
        />
      </div>);
  }
}

render(<AdminDashboard />, document.getElementById('app'));
