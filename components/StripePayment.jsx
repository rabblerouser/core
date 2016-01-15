var React = require('react');
var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;
import $ from 'jquery';

export default React.createClass({
    mixins: [ReactScriptLoaderMixin],
    stripeDisabled: false,
    getScriptURL: function () {
        return 'https://checkout.stripe.com/checkout.js';
    },

    statics: {
        stripeHandler: null,
        scriptDidError: false
    },

    onScriptLoaded: function () {
        if (!StripeButton.stripeHandler) {

            var req = new XMLHttpRequest();
            req.open('GET', document.location, false);
            req.send(null);
            var stripePublicKey = req.getResponseHeader('Stripe-Public-Key');
            if (!stripePublicKey || stripePublicKey === "undefined") {
                this.stripeDisabled = true;
                this.forceUpdate();
                return;
            }

            StripeButton.stripeHandler = StripeCheckout.configure({
                key: stripePublicKey,
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
        } else if (this.stripeDisabled) {
            console.log('Stripe has been disabled, could not find public key');
        } else if (StripeButton.stripeHandler) {
            this.showStripeDialog();
        }
    },
    render: function () {
        if (this.stripeDisabled) {
            console.log("stripe disabled");
            return <button className="hidden" onClick={this.onClick}>Credit/Debit card</button>;
        }
        return <button onClick={this.onClick}>Credit/Debit card</button>;

    }
});