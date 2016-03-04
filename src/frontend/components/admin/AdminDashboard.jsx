import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import ParticipantsList from './MembersList.jsx';
import GroupsList from './GroupsList.jsx';
import labService from '../../services/labService';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            members: [],
            groups: [],
            labs: [],
            currentLab: ''
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
                    <GroupsList groups={ this.state.groups } />
                    <ParticipantsList participants={ this.state.participants } groups={ this.state.groups }/>
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
