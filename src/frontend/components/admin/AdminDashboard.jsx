import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import _ from 'underscore';
import ParticipantsList from './ParticipantsList.jsx';
import AdminHeader from './AdminHeader.jsx';
import ErrorView from './ErrorView.jsx';
import GroupsView from './GroupsView.jsx';
import labService from '../../services/labService.js';
import groupService from '../../services/groupService.js';
import groupValidator from '../../services/groupValidator.js';

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
            pageErrors: [],
            onSaveGroup: (groupDetails) => {
                this.clearErrors();
                let errors = groupValidator.isValid(groupDetails);

                if(errors) {
                    this.handleError({message: 'Validation error'});
                } else {
                    let saveAction = this.state.groups.find(group => group.id === groupDetails.id) === undefined ? groupService.createGroup : groupService.updateGroup;
                    saveAction(groupDetails, this.state.currentLab.id)
                    .then( (savedGroup) => {
                        this.updateGroups(this.state.groups, savedGroup);
                    })
                    .catch(this.handleError.bind(this));
                }
            },
            onSelectGroup: (selected) => {
                this.clearErrors();
                this.updateGroupSelection(selected);
                this.setGroupFilter(selected);
            },
            onDeleteGroup: (selected) => {
                this.clearErrors();
                groupService.deleteGroup(selected, this.state.currentLab.id)
                .then(()=> {
                    this.setState({groups: this.findAndRemoveGroup(this.state.groups, selected)});
                    this.setGroupFilter();
                })
                .catch(this.handleError.bind(this));
            },
            onSaveParticipant: (selected) => {
                console.log(selected);
            }
        };
    }

    clearErrors() {
        this.setState({pageErrors: []});
    }

    handleError(error) {
        let pageErrors = this.state.pageErrors.slice(0);
        pageErrors.push(error.message);
        this.setState({pageErrors: pageErrors});

    }

    updateGroupSelection(selected) {
        let groups = this.state.groups.map(group => {
            return Object.assign({}, group, { selected: selected !== undefined && group.id === selected });
        });
        this.setState({groups: groups});
    }

    updateGroups(groups, group) {
        let newGroups = groups.slice(0);
        let oldGroup = newGroups.find (g => g.id === group.id);
        if(oldGroup) {
            Object.assign(oldGroup, group);
        }
        else {
            newGroups.push(group);
        }
        this.setState({groups: newGroups});
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
                { errorsView }
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
