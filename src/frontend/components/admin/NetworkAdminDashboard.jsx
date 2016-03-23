import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import _ from 'underscore';

import FilteredParticipantsList from './participantView/FilteredParticipantsList.jsx';
import AdminHeader from './AdminHeader.jsx';
import UserMessageView from './UserMessageView.jsx';
import GroupsView from './groupView/GroupsView.jsx';
import LabDetailsView from './labView/LabDetailsView.jsx';
import AdminsView from './adminsView/AdminsView.jsx';

import labService from '../../services/labService.js';
import groupService from '../../services/groupService.js';
import memberService from '../../services/memberService.js';
import adminService from '../../services/adminService.js';

import { AdminDashboard as Strings } from '../../config/strings.js';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            groups: [],
            labs: [],
            selectedGroupId: 'unassigned',
            selectedLab: {},
            userMessages: [],
            pageErrors: [],
            organisers: [],
            networkAdmins: [],
            onSaveGroup: (groupDetails) => {
                this.clearMessages();
                let saveAction = this.state.groups.find(group => group.id === groupDetails.id) === undefined ? groupService.createGroup : groupService.updateGroup;
                saveAction(groupDetails, this.state.selectedLab.id)
                .then((savedGroup) => {
                    this.updateGroups(this.state.groups, savedGroup);
                    this.setUserMessage('Group successfully saved');
                })
                .catch(this.handleError.bind(this));
            },
            onSelectGroup: (selected) => {
                this.clearMessages();
                this.updateGroupSelection(selected);
                this.setState({selectedGroupId: selected});
            },
            onDeleteGroup: (selected) => {
                this.clearMessages();
                groupService.deleteGroup(selected, this.state.selectedLab.id)
                .then(()=> {
                    this.removeAndUpdateGroups(this.state.groups, selected);
                    this.setUserMessage('Group successfully deleted');
                })
                .catch(this.handleError.bind(this));
            },
            onSaveParticipant: (participant) => {
                this.clearMessages();
                memberService.update(participant, this.state.selectedLab.id)
                    .then((savedParticipant) => {
                        this.updateParticipants(this.state.participants, savedParticipant);
                        this.setUserMessage('Participant successfully saved');
                    })
                    .catch(this.handleError.bind(this));
            },
            onSelectLab: (id) => {
                let lab = this.state.labs.find(lab => lab.id === id);
                this.updateLabSelection(lab);
            },
            onSaveLab: (labDetails) => {
                this.clearMessages();
                let saveAction = this.state.labs.find(lab => lab.id === labDetails.id) === undefined ? labService.create : labService.update;
                saveAction(labDetails, this.state.selectedLab.id)
                    .then((savedLab) => {
                        this.updateLabs(this.state.labs, savedLab);
                        this.setUserMessage('Labs successfully saved');
                    })
                    .catch(this.handleError.bind(this));
            },
            onDeleteLab: (selected) => {
                this.clearMessages();
                labService.delete(selected, this.state.selectedLab.id)
                .then(()=> {
                    this.removeAndUpdateLabs(this.state.labs, selected);
                    this.updateLabSelection(this.state.labs[0]);
                    this.setUserMessage('Lab successfully deleted');
                })
                .catch(this.handleError.bind(this));
            },
            onSaveOrganiser: (organiserDetails) => {
                this.clearMessages();
                let saveAction = this.state.organisers.find(organiser => organiser.id === organiserDetails.id) === undefined ? adminService.create : adminService.update;
                saveAction(organiserDetails, this.state.selectedLab.id)
                    .then((savedOrganiser) => {
                        this.updateOrganisers(this.state.organisers, savedOrganiser);
                        this.setUserMessage('Organiser successfully saved');
                    })
                    .catch(this.handleError.bind(this));
            },
            onDeleteOrganiser: (selected) => {
                this.clearMessages();
                adminService.delete(selected, this.state.selectedLab.id)
                .then(()=> {
                    this.removeAndUpdateOrganisers(this.state.organisers, selected);
                    this.setUserMessage('Organiser successfully deleted');
                })
                .catch(this.handleError.bind(this));
            },
            onSaveNetworkAdmin: (details) => {
                this.clearMessages();
                let saveAction = this.state.networkAdmins.find(admin => admin.id === details.id) === undefined ? adminService.createNetworkAdmin : adminService.updateNetworkAdmin;
                saveAction(details)
                    .then((savedAdmin) => {
                        this.updateNetworkAdmins(this.state.networkAdmins, savedAdmin);
                        this.setUserMessage('Network admin successfully saved');
                    })
                    .catch(this.handleError.bind(this));
            },
            onDeleteNetworkAdmin: (selected) => {
                this.clearMessages();
                adminService.deleteNetworkAdmin(selected)
                .then(()=> {
                    this.removeAndUpdateNetworkAdmins(this.state.networkAdmins, selected);
                    this.setUserMessage('Network admin successfully deleted');
                })
                .catch(this.handleError.bind(this));
            }
        };
    }

    clearMessages() {
        this.setState({userMessages: []});
        this.setState({pageErrors: []});
    }

    handleError() {
        let pageErrors = this.state.pageErrors.slice(0);
        pageErrors.push(Strings.RemoteSaveErrorMessage);
        this.setState({pageErrors: pageErrors});
    }

    setUserMessage(message) {
        let userMessages = this.state.userMessages.slice(0);
        userMessages.push(message);
        this.setState({userMessages: userMessages});
    }

    updateGroupSelection(selected) {
        let groups = this.state.groups.map(group => {
            return Object.assign({}, group, { selected: group.id === selected });
        });
        this.setState({groups: groups});
    }

    updateGroups(collection, element) {
        this.updateElements('groups', collection, element);
    }

    updateNetworksAdmins(collection, element) {
        this.updateElements('networkAdmins', collection, element);
    }

    updateOrganisers(collection, element) {
        this.updateElements('organisers', collection, element);
    }

    updateLabs(collection, element) {
        this.updateElements('labs', collection, element);
    }

    updateParticipants(collection, element) {
        this.updateElements('participants', collection, element);
    }

    updateElements(collectionName, collection, element) {
        let newElements = collection.slice(0);
        let oldElement = newElements.find (g => g.id === element.id);
        if(oldElement) {
            Object.assign(oldElement, element);
        }
        else {
            newElements.push(element);
        }
        let state = {};
        state[collectionName] = newElements;
        this.setState(state);
    }

    removeAndUpdateLabs(collection, element) {
        this.removeAndUpdate('labs', collection, element);
    }

    removeAndUpdateGroups(collection, element) {
        this.removeAndUpdate('groups', collection, element);
        let updatedParticipants = this.state.participants;
        updatedParticipants = updatedParticipants.map(p => {
            p.groups = _.reject(p.groups, g => g === element.id);
            return p;
        });
        this.setState({participants: updatedParticipants});
        this.setState({selectedGroupId: 'unassigned'});
    }

    removeAndUpdateOrganisers(collection, element) {
        this.removeAndUpdate('organisers', collection, element);
    }

    removeAndUpdateNetworkAdmins(collection, element) {
        this.removeAndUpdate('networkAdmins', collection, element);
    }

    removeAndUpdate(collectionName, collection, element) {
        let oldElement = collection.find(item => item.id === element.id);
        let state = {};
        state[collectionName] = _.without(collection, oldElement);
        this.setState(state);
    }

    componentDidMount() {
        labService.getMyLabs()
            .then( (labs) => {
                this.setState({labs: labs});
                this.updateLabSelection(labs[0]);
            });
        adminService.getNetworkAdmins()
            .then( (admins) => {
                this.setState({networkAdmins: admins});
            });

    }

    updateLabSelection(lab) {
        this.setState({selectedLab: lab});
        labService.getLabParticipants(lab.id)
                .then( participants => { this.setState({participants: participants});
                                         this.filterParticipantList();
                                        });
        labService.getLabGroups(lab.id)
                .then( groups => { this.setState({groups: groups}); });
        labService.getOrganisers(lab.id)
                .then( organisers => {this.setState({organisers: organisers});});
    }

    getSelectedGroup() {
        if(this.state.selectedGroupId === 'all' || this.state.selectedGroupId === 'unassigned') {
            return;
        }
        return this.state.groups.find(group => group.id === this.state.selectedGroupId);
    }

    render() {
        return (
            <div className="admin-container">
                <AdminHeader selectedLab={this.state.selectedLab} labs={this.state.labs} onSelectLab={this.state.onSelectLab}/>
                <UserMessageView
                    messages={this.state.userMessages}
                    errors={this.state.pageErrors}
                />
                <LabDetailsView
                    selectedLab={this.state.selectedLab}
                    onSaveLab={this.state.onSaveLab}
                    onDeleteLab={this.state.onDeleteLab}
                />
                <AdminsView
                    title={'Organisers'}
                    organisers={this.state.organisers}
                    onSaveOrganiser={this.state.onSaveOrganiser}
                    onDeleteOrganiser={this.state.onDeleteOrganiser}
                />
                <GroupsView
                    selectedGroup={this.getSelectedGroup()}
                    groups={this.state.groups}
                    onSaveGroup={this.state.onSaveGroup}
                    onDeleteGroup={this.state.onDeleteGroup}
                    onSelectGroup={this.state.onSelectGroup}
                />
                <FilteredParticipantsList
                    groupFilter={ this.state.selectedGroupId }
                    groups={ this.state.groups }
                    participants={ this.state.participants }
                    onSaveParticipant= { this.state.onSaveParticipant }
                />
                <AdminsView
                    title={'Network Admins'}
                    organisers={this.state.networkAdmins}
                    onSaveOrganiser={this.state.onSaveNetworkAdmin}
                    onDeleteOrganiser={this.state.onDeleteNetworkAdmin}
                />
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
