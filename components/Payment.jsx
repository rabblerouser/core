import React, {Component} from 'react';
import Errors from './Errors.jsx';
import StripePayment from './StripePayment.jsx';
import * as paymentValidator from '../lib/paymentValidator';
import $ from 'jquery';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.validator = paymentValidator;
        this.handleAmountChanged = this.handleAmountChanged.bind(this);
        this.handlePaymentTypeChanged = this.handlePaymentTypeChanged.bind(this);
        this.handleValidationErrors = this.handleValidationErrors.bind(this);
        this.processStripePayment = this.processStripePayment.bind(this);
        this.processOtherPayment = this.processOtherPayment.bind(this);
        this.processPayment = this.processPayment.bind(this);
        this.state = {amount : '', invalidFields: [], errorMessages: [], paymentType: ''};
    }

    handleValidationErrors(errorFields){
        var invalidFields = errorFields;
        var errors = [];
        let errorMessages = {
            totalAmount: "If you wish to contribute, the minimum is $1.",
            paymentType: "Please select a payment type."
        };

        if(_.indexOf(invalidFields, 'paymentType') > -1){
            invalidFields = ['paymentType'];
        }

        _.forEach(invalidFields, function(error){
            errors.push(errorMessages[error] || error);
        });

        this.setState({errorMessages: errors});
        this.setState({invalidFields: invalidFields});
    }

    handleAmountChanged(event) {
        this.setState({amount: event.target.value, invalidFields: []});
    }

    handlePaymentTypeChanged(event) {
        if(_.indexOf(this.state.invalidFields, "paymentType") > -1){
            this.handleValidationErrors(_.pull(this.state.invalidFields, 'paymentType'));
        }
        this.setState({paymentType: event.target.value});
    }

    processStripePayment() {
      let stripeReference = this.refs.stripePayment;

      if (stripeReference.stripeDidError) {
          console.log('failed to load script');
      } else if (stripeReference.stripeDisabled) {
          console.log('Stripe has been disabled, could not find public key');
      } else if (stripeReference) {
          stripeReference.showStripeDialog();
      }
    }

    processOtherPayment(fieldValues) {
      $.ajax({
              type: 'POST',
              url: '/invoices',
              data: fieldValues,
          success: function (value) {
              this.props.nextStep();
          }.bind(this),
          error: function(request, status, error) {
              this.handleValidationErrors(error);
          }.bind(this)
      });
    }

    processPayment() {
        var fieldValues = {
            memberEmail: this.props.email,
            totalAmount: this.state.paymentType === 'noContribute' ? 1 : Math.floor(parseFloat(this.state.amount)),
            paymentType: this.state.paymentType,
            uuid: this.props.memberAndInvoice.uuid,
            membershipType: this.props.memberAndInvoice.membershipType,
            invoiceId: this.props.memberAndInvoice.invoiceId };

        var invalidFields = this.validator.isValid(fieldValues);
        if (invalidFields.length > 0) {
            return this.handleValidationErrors(invalidFields);
        }

        if (this.state.paymentType === 'creditOrDebitCard') {
          this.processStripePayment();
        } else {
          this.processOtherPayment(fieldValues);
        }
    };

    render() {
        return (<fieldset>
            <h1 className="form-title">Pay What You Want</h1>
            <div className="form-body">
                <Errors invalidFields={this.state.errorMessages} />
                <div className="reminder">
                    <img src="/images/reminder.svg"/>
                    <div className="reminder-text">
                        Membership of Pirate Party Australia is currently <b>whatever you want!</b>
                    </div>
                </div>
                <div className="heading">
                    <h2 className="sub-title"> Choose a Payment Method</h2>
                    <i>Pay your selected amount.</i>
                </div>
                <div className="field-group">
                    <label>
                        <input type="radio" name="paymentType" value="paypal" onChange={this.handlePaymentTypeChanged}/>PayPal
                    </label>
                    <StripePayment  ref="stripePayment"
                                    onChange={this.handlePaymentTypeChanged}
                                    setState={this.setState}
                                    email={this.props.email}
                                    amount={this.state.amount}
                                    memberAndInvoice={this.props.memberAndInvoice}
                                    nextStep={this.props.nextStep}/>
                    <label>
                        <input type="radio" name="paymentType" value="deposit" onChange={this.handlePaymentTypeChanged}/>Direct Deposit
                    </label>
                    <label>
                        <input type="radio" name="paymentType" value="cheque" onChange={this.handlePaymentTypeChanged}/>Cheque
                    </label>
                    <label>
                        <input type="radio" name="paymentType" value="noContribute" onChange={this.handlePaymentTypeChanged}/>I do not want to contribute.
                    </label>
                </div>
                <div className={(() => { return this.state.paymentType==='noContribute' ? 'hidden' : ''})()}>
                  <div className="heading">
                      <h2 className="sub-title"> Membership Contribution</h2>
                      <i>Please enter an amount.</i>
                  </div>
                  <div className="contribution-amount">
                      <div className="currency">$AUD</div>
                      <input type="text" name="totalAmount" id="totalAmount" onChange={this.handleAmountChanged}/>
                  </div>
                </div>
                <div className="navigation">
                    <button type="button" id="payment-continue-button" onClick={this.processPayment}>Continue</button>
                </div>
            </div>
        </fieldset>)
    }
}
