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
            groups: []
        };
    }

    componentDidMount() {
        labService.getLabPartipicants()
          .then( (participants) => {
            this.setState({participants: participants});
        });

        labService.getLabGroups()
          .then( (groups) => {
            this.setState({groups: groups});
        });
    }

    render() {
        return (
            <div className="admin-container">
                <div className="container">
                    <GroupsList groups={ this.state.groups } />
                    <ParticipantsList participants={ this.state.participants }/>
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));
