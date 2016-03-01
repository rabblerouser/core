import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {members: []};
        this.loadMembers = this.loadMembers.bind(this);
        this.loadMembers();
    }

    loadMembers() {
        $.ajax({
            type: 'GET',
            url: '/members',
            dataType: 'json',
            success: function(value) {
                this.setState({members: value.members});
            }.bind(this)
        });
    }

    render() {

        let columns = [
            {
                property: 'participantName',
                header: 'Participant'
            }
        ];

        let Table = require('reactabular').Table;

        return (
            <div className="admin-container">
                <div className="container">
                    <Table columns={columns} data={this.state.members} />
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));