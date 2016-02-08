import React, {Component} from 'react';
import $ from 'jquery';

export default class Secretary extends Component {
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
        return(
            <table className="secretary-table">
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
                            <td className='first-name'>{member.firstName}</td>
                            <td className='last-name'>{member.lastName}</td>
                            <td className='postcode'>{member.residentialAddress.postcode}</td>
                            <td className='state'>{member.residentialAddress.state}</td>
                            <td className='country'>{member.residentialAddress.country}</td>
                            <td className='membership-type'>{member.membershipType}</td>
                            {!!member.verified ?
                            <td className='verified'> verified</td>: <td className='unverified'> unverified</td>}
                            <td className='link'><a href='#' >linkhere</a></td>
                        </tr>);
                        })}
                </tbody>

            </table>);
    }
}
