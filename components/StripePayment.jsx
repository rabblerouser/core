var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
import $ from 'jquery';

export default React.createClass({
    mixins: [ReactScriptLoaderMixin],
    getScriptURL: function () {
        return 'https://checkout.stripe.com/checkout.js';
    },

    statics: {
        stripeHandler: null,
        scriptDidError: false
    },

    onScriptLoaded: function () {
        if (!StripeButton.stripeHandler) {
            StripeButton.stripeHandler = StripeCheckout.configure({
                key: 'pk_test_4SqBME7pIDAKSWRft4OpviYK',
                image: '/images/logo.svg',
                email: this.props.email,
                token: function (token) {
                    $.ajax({
                        type: 'POST',
                        url: '/invoices',
                        data: {
                            memberEmail: this.props.email,
                            totalAmount: parseFloat(this.props.amount),
                            paymentType: 'stripe',
                            stripeToken: token
                        }
                    });
                }.bind(this)
            });
            if (this.hasPendingClick) {
                this.showStripeDialog();
            }
        }
    },
    showStripeDialog: function () {
        StripeButton.stripeHandler.open({
            name: 'Pirate Party',
            description: 'membership application',
            //The server expects to be sent in cents, however users expect in dollars
            amount: parseFloat(this.props.amount) * 100
        });
    },
    onScriptError: function () {
        StripeButton.scriptDidError = true;
    },
    onClick: function () {
        if (StripeButton.scriptDidError) {
            console.log('failed to load script');
        } else if (StripeButton.stripeHandler) {
            this.showStripeDialog();
        }
    },
    render: function () {
        return (
            <button onClick={this.onClick}>Credit/Debit cardr</button>
        );
    }
});