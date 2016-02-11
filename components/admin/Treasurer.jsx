import React, {Component} from 'react';
import $ from 'jquery';

export default class Treasurer extends Component {
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
            url: '/members/unconfirmed',
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
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Reference Number</th>
                    <th>Payment Type</th>
                    <th>Amount</th>
                    <th>Accept Payment</th>
                </tr>
                </thead>
                <tbody>
                {this.state.members.map(function(member) {
                    return(
                    <tr>
                        <td className='first-name'>{member.firstName}</td>
                        <td className='last-name'>{member.lastName}</td>
                        <td className='reference-number'>{member.reference}</td>
                        <td className='payment-type'>{member.paymentType}</td>
                        <td className='amount'>{member.totalAmountInCents/100}</td>
                        <td className='accept-payment'>link here</td>
                    </tr>);
                    })}
                </tbody>

            </table>);
    }
}
