import React, {Component} from 'react';
import $ from 'jquery';
var scriptLoader = require('load-script').bind(this);

export default class StripePayment extends Component {
    constructor(props) {
        super(props);
        this.stripeDisabled = false;
        this.stripeHandler = null;
        this.scriptDidError = false;
        this.loadStripe();

        this.loadStripe = this.loadStripe.bind(this);
        this.showStripeDialog = this.showStripeDialog.bind(this);
        this.onScriptError = this.onScriptError.bind(this);
        this.onClick = this.onClick.bind(this);
        this.render = this.render.bind(this);

    }

    loadStripe() {
        scriptLoader('https://checkout.stripe.com/checkout.js', function (err, script) {
            console.log(script);
            if (!this.stripeHandler) {
                if(err) {
                    this.onScriptError();
                    return;
                }
                var req = new XMLHttpRequest();
                req.open('GET', document.location, false);
                req.send(null);
                var stripePublicKey = req.getResponseHeader('Stripe-Public-Key');
                if (!stripePublicKey || stripePublicKey === "undefined") {
                    this.stripeDisabled = true;
                    this.forceUpdate();
                    return;
                }

                this.stripeHandler = StripeCheckout.configure({
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
        }.bind(this));
    };

    showStripeDialog() {
        this.stripeHandler.open({
            name: 'Pirate Party',
            description: 'membership application',
            //The server expects to be sent in cents, however users expect in dollars
            amount: parseFloat(this.props.amount) * 100
        });
    };

    onScriptError() {
        this.scriptDidError = true;
    };

    onClick() {
        if (this.scriptDidError) {
            console.log('failed to load script');
        } else if (this.stripeDisabled) {
            console.log('Stripe has been disabled, could not find public key');
        } else if (this.stripeHandler) {
            this.showStripeDialog();
        }
    };

    render() {
        if (this.stripeDisabled) {
            console.log("stripe disabled");
            return <button className="hidden" onClick={this.onClick}>Credit/Debit card</button>;
        }
        return <button onClick={this.onClick}>Credit/Debit card</button>;

    };
};