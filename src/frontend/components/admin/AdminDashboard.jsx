import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import ParticipantsList from './MembersList.jsx';
import GroupsList from './GroupsList.jsx';
import labService from '../../services/labService.js';
import groupService from '../../services/groupService.js';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            groups: [],
            labs: [],
            currentLab: '',
            onSaveGroup: (groupDetails) => {
                groupService.createOrUpdateGroup(groupDetails, this.state.currentLab.id)
                .then( (savedGroup) => {
                    let groups = this.state.groups.slice(0);
                    let group = groups.find (g => g.id === savedGroup.id);
                    if(group) {
                        Object.assign(group, savedGroup);
                    }
                    else {
                        groups.push(savedGroup);
                    }
                    this.setState({groups: groups});
                });
            }
        };
    }

    componentDidMount() {
        labService.getMyLabs()
            .then( (labs) => {
                this.setState({labs: labs});
                this.setState({currentLab: labs[0]});
                labService.getLabPartipicants(this.state.currentLab.id)
                        .then( participants => { this.setState({participants: participants}); });
                labService.getLabGroups(this.state.currentLab.id)
                        .then( groups => { this.setState({groups: groups}); });
            });
    }

    render() {
        return (
            <div className="admin-container">
                <div className="container">
                    <div className="header">
                        <img src ='/images/the_lab_logo.svg'/>
                    </div>
                    <nav id="groups">
                        <GroupsList editable={ true } groups={ this.state.groups } onSave={ this.state.onSaveGroup } />
                    </nav>
                </div>
                <div className="container">
                    <ParticipantsList participants={ this.state.participants } groups={ this.state.groups }/>

                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
