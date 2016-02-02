import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Errors from './Errors.jsx';
var scriptLoader = require('load-script').bind(this);

export default class StripePayment extends Component {
    constructor(props) {
        super(props);
        this.stripeDisabled = false;
        this.stripeHandler = null;
        this.loadStripe();

        this.loadStripe = this.loadStripe.bind(this);
        this.showStripeDialog = this.showStripeDialog.bind(this);
        this.render = this.render.bind(this);

    }

    showStripeDialog() {
      this.stripeHandler.open({
          name: 'Pirate Party',
          description: 'Membership application',
          //The server expects to be sent in cents, however users expect in dollars
          amount: Math.floor(parseFloat(this.props.amount)) * 100
        });
      };

      loadStripe() {
        scriptLoader('https://checkout.stripe.com/checkout.js', function (err, script) {
            if (!this.stripeHandler) {
                if(err) {
                    this.stripeDidError = true;
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
                            url: '/invoices/update',
                            data: {
                            memberEmail: this.props.email,
                            totalAmount: Math.floor(parseFloat(this.props.amount)),
                            paymentType: 'stripe',
                            stripeToken: token,
                            invoiceId: this.props.invoiceId
                        },
                        success: function (value) {
                            this.props.nextStep();
                        }.bind(this),
                        error: function(request, status, error) {
                            this.props.updateErrors(error);
                        }.bind(this)
                    });
                }.bind(this)
            });
        }
    }.bind(this))
  };

  render() {
      if (this.stripeDisabled) {
          console.log("stripe disabled");
          return null;
      }

      return <label>
          <input type="radio" name="paymentType" value="creditOrDebitCard" onChange={this.props.onChange}/>
          Credit/Debit card
        </label>;
  };
};
