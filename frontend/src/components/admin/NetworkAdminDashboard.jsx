import React, { Component } from 'react';
import { render } from 'react-dom';
import _ from 'underscore';
import AdminHeader from './AdminHeader.jsx';
import UserMessageView from './UserMessageView.jsx';
import LabDetailsView from './labView/LabDetailsView.jsx';
import GroupsViewContainer from './groupView/GroupsViewContainer.jsx';
import OrganisersViewContainer from './adminsView/OrganisersViewContainer.jsx';
import NetworkAdminsViewContainer from './adminsView/NetworkAdminsViewContainer.jsx';
import labService from '../../services/labService.js';
import { AdminDashboard as Strings } from '../../config/strings.js';

export default class NetworkAdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labs: [],
      selectedLab: {},
      userMessages: [],
      pageErrors: [],
      onSelectLab: id => {
        const selectedLab = this.state.labs.find(lab => lab.id === id);
        this.updateLabSelection(selectedLab);
      },
      onSaveLab: labDetails => {
        this.clearMessages();
        const saveAction = this.state.labs.find(lab => lab.id === labDetails.id) === undefined ?
          labService.create :
          labService.update;
        saveAction(labDetails, this.state.selectedLab.id)
          .then(savedLab => {
            this.updateLabs(this.state.labs, savedLab);
            this.setUserMessage('Labs successfully saved');
          })
          .catch(this.handleError.bind(this));
      },
      onDeleteLab: selected => {
        this.clearMessages();
        labService.delete(selected, this.state.selectedLab.id)
          .then(() => {
            this.removeAndUpdateLabs(this.state.labs, selected);
            this.updateLabSelection(this.state.labs[0]);
            this.setUserMessage('Lab successfully deleted');
          })
          .catch(this.handleError.bind(this));
      },
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

  removeAndUpdate(collectionName, collection, element) {
    const oldElement = collection.find(item => item.id === element.id);
    const state = {};
    state[collectionName] = _.without(collection, oldElement);
    this.setState(state);
  }

  componentDidMount() {
    labService.getMyLabs()
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
        <AdminHeader selectedLab={this.state.selectedLab} labs={this.state.labs} onSelectLab={this.state.onSelectLab} />
        <UserMessageView
          messages={this.state.userMessages}
          errors={this.state.pageErrors}
        />
        <LabDetailsView
          selectedLab={this.state.selectedLab}
          onSaveLab={this.state.onSaveLab}
          onDeleteLab={this.state.onDeleteLab}
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
        <NetworkAdminsViewContainer
          onPreAction={this.clearMessages.bind(this)}
          onActionError={this.handleError.bind(this)}
          onActionSuccess={this.setUserMessage.bind(this)}
        />
      </div>);
  }
}

render(<NetworkAdminDashboard />, document.getElementById('app'));
