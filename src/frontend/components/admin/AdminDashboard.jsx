import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import _ from 'underscore';
import ParticipantsList from './ParticipantsList.jsx';
import AdminHeader from './AdminHeader.jsx';
import UserMessageView from './UserMessageView.jsx';
import GroupsView from './GroupsView.jsx';
import labService from '../../services/labService.js';
import groupService from '../../services/groupService.js';
import memberService from '../../services/memberService.js';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            groups: [],
            labs: [],
            selectedGroup: undefined,
            currentLab: '',
            filteredParticipantList: [],
            userMessages: [],
            pageErrors: [],
            onSaveGroup: (groupDetails) => {
                this.clearMessages();
                let saveAction = this.state.groups.find(group => group.id === groupDetails.id) === undefined ? groupService.createGroup : groupService.updateGroup;
                saveAction(groupDetails, this.state.currentLab.id)
                .then((savedGroup) => {
                    this.updateGroups(this.state.groups, savedGroup);
                    this.setUserMessage('Group successfully saved');
                })
                .catch((error) => {
                    this.handleError(`There was a problem saving the group: ${error.message}`);
                });
            },
            onSelectGroup: (selected) => {
                this.clearMessages();
                this.updateGroupSelection(selected);
                this.setGroupFilter(selected);
            },
            onDeleteGroup: (selected) => {
                this.clearMessages();
                groupService.deleteGroup(selected, this.state.currentLab.id)
                .then(()=> {
                    this.setState({groups: this.findAndRemoveGroup(this.state.groups, selected)});
                    this.setGroupFilter();
                    this.setUserMessage('Group successfully deleted');
                })
                .catch((error) => {
                    this.handleError(`There was a problem deleting the group: ${error.message}`);
                });
            },
            onSaveParticipant: (participant, selectedGroups) => {
                this.clearMessages();
                memberService.update(participant, this.state.currentLab.id)
                    .then((savedParticipant) => {
                        this.updateGroups(this.state.participants, savedParticipant);
                        this.setUserMessage('Participant successfully saved');
                    })
                    .catch((error) => {
                        this.handleError(`There was a problem saving the prticipant: ${error.message}`);
                    });
                console.log(selectedGroups);
            }
        };
    }

    clearMessages() {
        this.setState({userMessages: []});
        this.setState({pageErrors: []});
    }

    handleError(error) {
        let pageErrors = this.state.pageErrors.slice(0);
        pageErrors.push(error);
        this.setState({pageErrors: pageErrors});
    }

    setUserMessage(message) {
        let userMessages = this.state.userMessages.slice(0);
        userMessages.push(message);

        this.setState({userMessages: userMessages});
    }

    updateGroupSelection(selected) {
        let groups = this.state.groups.map(group => {
            return Object.assign({}, group, { selected: selected !== undefined && group.id === selected });
        });
        this.setState({groups: groups});
    }

    updateGroups(collection, element) {
        updateElements('groups', collection, element);
    }

    updateParticipants(collection, element) {
        updateElements('participants', collection, element);
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

    findAndRemoveGroup(groups, selected) {
        let group = groups.find(group => group.id === selected.id);
        return _.without(groups, group);
    }

    setGroupFilter(selected) {
        this.setState({selectedGroup: selected ? selected : undefined}, this.filterParticipantList);
    }

    componentDidMount() {
        labService.getMyLabs()
            .then( (labs) => {
                this.setState({labs: labs});
                this.setState({currentLab: labs[0]});
                labService.getLabPartipicants(this.state.currentLab.id)
                        .then( participants => { this.setState({participants: participants});
                                                 this.filterParticipantList();
                                                });
                labService.getLabGroups(this.state.currentLab.id)
                        .then( groups => { this.setState({groups: groups}); });
            });
    }

    filterParticipantList() {
        if (!this.state.selectedGroup) {
            this.setState({filteredParticipantList: this.state.participants});
        }
        else {
            this.setState({filteredParticipantList:
                    this.state.participants.filter( element => {
                        return element.Groups.filter( group => {
                            return group.id === this.state.selectedGroup.id;
                        }).length > 0;
                    })
            });
        }
    }

    getSelectedGroup() {
        if(this.state.selectedGroup === undefined) {
            return;
        }
        return this.state.groups.find(group => group.id === this.state.selectedGroup);
    }

    render() {
        let errorsView = this.state.pageErrors.length > 0 ? ( <ErrorView errors={ this.state.pageErrors } />) : '';
        return (
            <div className="admin-container">
                <AdminHeader />
                <UserMessageView
                    messages={this.state.userMessages}
                    errors={this.state.pageErrors}
                />
                <GroupsView
                    selectedGroup={this.getSelectedGroup()}
                    groups={this.state.groups}
                    onSaveGroup={this.state.onSaveGroup}
                    onDeleteGroup={this.state.onDeleteGroup}
                    onSelectGroup={this.state.onSelectGroup}
                />
                <ParticipantsList
                    participants={ this.state.filteredParticipantList }
                    groups={ this.state.groups }
                    onSave= { this.state.onSaveParticipant }
                />
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
