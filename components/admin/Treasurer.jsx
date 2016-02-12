import React, {Component} from 'react';
import $ from 'jquery';

export default class Treasurer extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.state = {invoices: []};
        this.loadInvoices = this.loadInvoices.bind(this);
        this.acceptPayment = this.acceptPayment.bind(this);
        this.loadInvoices();
    }

    loadInvoices() {
        $.ajax({
            type: 'GET',
            url: '/invoices/unconfirmed',
            dataType: 'json',
            success: function(value) {
                this.setState({invoices: value.members});
            }.bind(this)
        });
    }

    acceptPayment(invoice) {
        $.ajax({
            type: 'POST',
            url: '/invoices/unconfirmed/' + invoice.reference,
            dataType: 'json',
            success: function () {
                let newInvoices = this.state.invoices;
                delete newInvoices[newInvoices.indexOf(invoice)];
                this.setState({invoices: newInvoices});
            }.bind(this),
            error: function (error) {
                console.log(error);
            }
        });
    }

    render() {
        return(
            <table className='admin-table'>
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
                {this.state.invoices.map(function(invoice) {
                    return(
                    <tr>
                        <td className='first-name'>{invoice.firstName}</td>
                        <td className='last-name'>{invoice.lastName}</td>
                        <td className='reference-number'>{invoice.reference}</td>
                        <td className='payment-type'>{invoice.paymentType}</td>
                        <td className='amount'>{invoice.totalAmountInCents/100}</td>
                        <td className='accept-payment'><a href='#' className='accept-link' onClick={this.acceptPayment.bind(this, invoice)}>Accept</a></td>
                    </tr>);
                    }.bind(this))}
                </tbody>

            </table>);
    }
}
