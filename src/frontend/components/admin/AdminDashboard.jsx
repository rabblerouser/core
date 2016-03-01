import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
let Table = require('reactabular').Table;

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
                property: 'firstName',
                header: 'Participant’s Name'
            },
            {
                property: 'contactFirstName',
                header: 'Parent’s Name'
            },
            {
                property: 'primaryPhoneNumber',
                header: 'Phone Number'
            },
            {
                property: 'email',
                header: 'Email'
            },
            {
                property: 'dateOfBirth',
                header: 'Year of Birth'
            },
            {
                property: 'schoolType',
                header: 'School Type'
            },
            {
                property: 'additionalInfo',
                header: 'Notes'
            }
        ];

        return (
            <div className="admin-container">
                <div className="container">
                    <Table columns={columns} data={this.state.members} />
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));