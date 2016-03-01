import React, {Component} from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import {sortByOrder} from 'lodash';
let Table = require('reactabular').Table;
let sortColumn = require('reactabular').sortColumn;

export default class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {
            members: [],
            columns: [
                {
                    property: 'firstName',
                    header: 'Participant’s Name'
                },
                {
                    property: 'lastName',
                    header: 'Participant’s Last Name'
                },
                {
                    property: 'contactFirstName',
                    header: 'Parent’s Name'
                },
                {
                    property: 'contactLastName',
                    header: 'Parent’s Last Name'
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
                    header: 'Year of Birth',
                    cell: (dob) => dob.substring(0,4)
                },
                {
                    property: 'schoolType',
                    header: 'School Type'
                },
                {
                    property: 'additionalInfo',
                    header: 'Notes'
                }
            ],
            columnNames: {
                onClick: (column) => {
                    sortColumn(
                        this.state.columns,
                        column,
                        this.setState.bind(this)
                    );
                }
            }};
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
        let data = sortColumn.sort(this.state.members, this.state.sortingColumn, sortByOrder);

        return (
            <div className="admin-container">
                <div className="container">
                    <Table columns={this.state.columns} data={data} columnNames={this.state.columnNames} />
                </div>
            </div>);
    }
}

render(<AdminDashboard />, document.getElementById('app'));