import React, {Component} from 'react';
import $ from 'jquery';

export default class Secretary extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {members: []};
        this.loadMembers();
    }

    loadMembers() {
        $.get({
            url: '/members',
            dataType: 'json',
            success: function(value) {
                this.setState({members: value.members});
            }.bind(this)
        });
    }

    render() {
        return(
            <table>
                <thead>
                    <tr>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Postcode</th>
                        <th>State</th>
                        <th>Country</th>
                        <th>Membership</th>
                        <th>Status</th>
                        <th>Full Info</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.members.map(function(member) {
                        return(
                        <tr>
                            <td>{member.firstName}</td>
                            <td>{member.lastName}</td>
                            <td>{member.residentialAddress.postcode}</td>
                            <td>{member.residentialAddress.state}</td>
                            <td>{member.residentialAddress.country}</td>
                            <td>{member.membershipType}</td>
                            {!!member.verified ?
                            <td className="verified"> verified</td>: <td className="unverified"> unverified</td>}
                            <td>linkhere</td>
                        </tr>);
                        })}
                </tbody>

            </table>);
    }
}
