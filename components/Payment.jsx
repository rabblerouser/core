import React, {Component} from 'react';
import Errors from './Errors.jsx';
import $ from 'jquery';
var scriptLoader = require('load-script');

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.stripeHandler = null;
        this.loadStripe();

        this.loadStripe = this.loadStripe.bind(this);
        this.handleAmountChanged = this.handleAmountChanged.bind(this);
        this.handlePaymentTypeChanged = this.handlePaymentTypeChanged.bind(this);
        this.showStripeDialog = this.showStripeDialog.bind(this);
        this.processPayment = this.processPayment.bind(this);
        this.state = {amount : '', invalidFields: [], paymentType: '', stripeDidError: false, stripeDisabled: false};

    }

    handleAmountChanged(event) {
        this.setState({amount: event.target.value, invalidFields: []});
    }

    handlePaymentTypeChanged(event) {
      this.setState({paymentType: event.target.value});
    }

    processPayment() {
        if(this.state.amount < 1) {
          this.setState({invalidFields:["Can not use card for less than $1"]});
          return;
        }

        if(this.state.paymentType === 'creditOrDebitCard') {
          if (this.state.stripeDidError) {
              console.log('failed to load script');
          } else if (this.state.stripeDisabled) {
              console.log('Stripe has been disabled, could not find public key');
          } else if (this.stripeHandler) {
              this.showStripeDialog();
          }
        } else {
          this.props.nextStep();
        }
    };

    showStripeDialog() {
        this.stripeHandler.open({
            name: 'Pirate Party',
            description: 'membership application',
            //The server expects to be sent in cents, however users expect in dollars
            amount: Math.floor(parseFloat(this.props.amount)) * 100
        });
    };

    loadStripe() {
        scriptLoader('https://checkout.stripe.com/checkout.js', function (err, script) {
            if (!this.stripeHandler) {
                if(err) {
                    this.setState({stripeDidError: true});
                    return;
                }
                var req = new XMLHttpRequest();
                req.open('GET', document.location, false);
                req.send(null);
                var stripePublicKey = req.getResponseHeader('Stripe-Public-Key');
                if (!stripePublicKey || stripePublicKey === "undefined") {
                    this.setState({stripeDisabled: true});
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
                                totalAmount: Math.floor(parseFloat(this.state.amount)),
                                paymentType: 'stripe',
                                stripeToken: token
                            },
                            success: function (value) {
                                this.props.nextStep();
                            }.bind(this),
                            error: function(request, status, error) {
                                this.setState({invalidFields: error});
                            }.bind(this)
                        });
                    }.bind(this)
                });
            }
        }.bind(this));
    };

    render() {
        return (<fieldset>
            <h1 className="form-title">Pay What You Want</h1>
            <div className="form-body">
                <Errors invalidFields={this.state.invalidFields} />
                <div className="reminder">
                    <img src="/images/reminder.svg"/>
                    <div className="reminder-text">
                        <b>Full Membership</b> of Pirate Party Australia is currently <b>Whatever you want!</b>
                    </div>
                </div>
                <div className="heading">
                    <h2 className="sub-title"> Membership Contribution</h2>
                    <i>Please enter a whole dollar value (minimum $0)</i>
                </div>
                <div className="contribution-amount">
                    <div className="currency">$AUD</div>
                    <input type="text" name="totalAmount" id="totalAmount" onChange={this.handleAmountChanged}/>
                </div>
                <div className="heading">
                    <h2 className="sub-title"> Choose a Payment Method</h2>
                    <i>Pay your selected amount.</i>
                </div>
                <div className="field-group">
                    <label>
                        <input type="radio" name="paymentType" value="deposit" onChange={this.handlePaymentTypeChanged}/>Direct Debit
                    </label>
                    <label>
                        <input type="radio" name="paymentType" value="cheque" onChange={this.handlePaymentTypeChanged}/>Cheque
                    </label>
                    <label className={(() => { return this.state.stripeDisabled ? 'hidden' : ''})()}>
                        <input type="radio" name="paymentType" value="creditOrDebitCard" onChange={this.handlePaymentTypeChanged}/>Credit/Debit card
                    </label>
                </div>
                <div className="navigation">
                    <button type="button" id="payment-continue-button" onClick={this.processPayment}>Continue</button>
                    <p>or <a id="payment-go-back">go back</a></p>
                </div>
            </div>
        </fieldset>)
    }
}
