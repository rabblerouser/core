import React, {Component} from 'react';
import Errors from './Errors.jsx';
import StripePayment from './StripePayment.jsx';
import PaypalPayment from './PaypalPayment.jsx';
import Button from './Button.jsx';
import * as paymentValidator from '../lib/paymentValidator';
import PaymentInfo from './payment-info-box/PaymentInfo.jsx';
import $ from 'jquery';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.validator = paymentValidator;
        this.handleAmountChanged = this.handleAmountChanged.bind(this);
        this.handlePaymentTypeChanged = this.handlePaymentTypeChanged.bind(this);
        this.handleValidationErrors = this.handleValidationErrors.bind(this);
        this.processStripePayment = this.processStripePayment.bind(this);
        this.processPaypalPayment = this.processPaypalPayment.bind(this);
        this.processOtherPayment = this.processOtherPayment.bind(this);
        this.processPayment = this.processPayment.bind(this);
        this.updateErrorMessage = this.updateErrorMessage.bind(this);
        this.isValidationError = this.isValidationError.bind(this);
        this.validationErrorClass = this.validationErrorClass.bind(this);
        this.state = { amount : '50', invalidFields: [], errorMessages: [],
            paymentType: '', scrollToError: true, continueButtonDisabled: false };
    }

    handleValidationErrors(errorFields, scrollToError){
        var invalidFields = errorFields;
        var errors = [];
        let errorMessages = {
            totalAmount: 'If you wish to contribute, the minimum is $1.',
            paymentType: 'Please select a payment method.'
        };

        if(_.indexOf(invalidFields, 'paymentType') > -1){
            invalidFields = ['paymentType'];
        }

        _.forEach(invalidFields, function(error){
            errors.push(errorMessages[error] || error);
        });

        this.setState({errorMessages: errors, invalidFields: invalidFields, scrollToError: scrollToError});
    }

    updateErrorMessage(errorMessages) {
        this.setState({errorMessages: [errorMessages]});
    }
    
     isValidationError(fieldName) {
      return _.indexOf(this.state.invalidFields, fieldName) > -1;
    }
    
    validationErrorClass(fieldName) {
        if(this.isValidationError(fieldName)){
            return 'invalid contribution-amount';
        }
        return 'contribution-amount';
    }

    handleAmountChanged(event) {
        this.setState({amount: event.target.value, invalidFields: []});
    }

    handlePaymentTypeChanged(event) {
        this.handleValidationErrors(_.pull(this.state.invalidFields, 'paymentType'), false);
        this.setState({paymentType: event.target.value});
        this.setState({continueButtonDisabled: false})
    }

    processStripePayment() {
      let stripeReference = this.refs.stripePayment;
      if (stripeReference.stripeDidError) {
          console.log('failed to load script');
      } else if (stripeReference.stripeDisabled) {
          console.log('Stripe has been disabled, could not find public key');
      } else if (stripeReference) {
          stripeReference.showStripeDialog();
          this.setState({ continueButtonDisabled: true })
      }
    }

    processPaypalPayment(fieldValues) {
      let paypalReference = this.refs.paypalPayment;

      if(paypalReference.paypalDisabled) {
          console.log('Paypal has been disabled');
      } else if(paypalReference) {
          paypalReference.checkout(this.state.amount);
          $.ajax({
                  type: 'POST',
                  url: '/invoices/update',
                  data: fieldValues,
              success: function (value) {
              },
              error: function(request, status, error) {
                  this.setState({errorMessages: [error]});
              }.bind(this)
          });
      }
    }

    processOtherPayment(fieldValues) {
      $.ajax({
              type: 'POST',
              url: '/invoices/update',
              data: fieldValues,
          success: function (value) {
              this.props.nextStep();
          }.bind(this),
          error: function(request, status, error) {
              this.setState({errorMessages: [JSON.parse(request.responseText).errors]});
          }.bind(this)
      });
    }

    processPayment() {
        var fieldValues = {
            totalAmount: this.state.paymentType === 'noContribute' ? 0 : Math.floor(Number(this.state.amount)),
            paymentType: this.state.paymentType,
            invoiceId: this.props.invoiceId };

        var invalidFields;
        if(this.state.paymentType === 'noContribute'){
            invalidFields = this.validator.isValidNoContribute(fieldValues);
        } else {
            invalidFields = this.validator.isValid(fieldValues);
        }
        if (invalidFields.length > 0) {
            return this.handleValidationErrors(invalidFields, true);
        }

        if (this.state.paymentType === 'creditOrDebitCard') {
          this.processStripePayment();
        } else if (this.state.paymentType === 'paypal') {
          this.processPaypalPayment(fieldValues);
        } else {
          this.processOtherPayment(fieldValues);
        }
    }

    render() {
        return (<fieldset>
            <h1 className="form-title">Pay What You Want</h1>
            <div className="form-body">
                <Errors invalidFields={this.state.errorMessages}
                        scrollToError={this.state.scrollToError}
                        validationErrorText="Please check the following fields:"/>
                <div className="reminder">
                    <img src="/images/reminder.svg"/>
                    <div className="reminder-text">
                        The cost of membership of Pirate Party Australia is currently <b>whatever you want</b>!
                    </div>
                </div>
                <div className="heading">
                    <h2 className="sub-title">How would you like to contribute?</h2> 
                     <div className="sub-description">Choose from the options below.</div>
                </div>
                <div className="field-group" id="payments">
                    <PaypalPayment ref="paypalPayment"
                                    onChange={this.handlePaymentTypeChanged}
                                    amount={this.state.amount}
                                    invoiceId={this.props.invoiceId}
                                    nextStep={this.props.nextStep}/>

                    <StripePayment  ref="stripePayment"
                                    onChange={this.handlePaymentTypeChanged}
                                    updateErrors={this.updateErrorMessage}
                                    email={this.props.email}
                                    amount={this.state.amount}
                                    invoiceId={this.props.invoiceId}
                                    nextStep={this.props.nextStep} />
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
                <PaymentInfo paymentType={this.state.paymentType}/>
                <div className={(() => { return this.state.paymentType==='' || this.state.paymentType==='noContribute' ? 'hidden' : ''})()}>
                    <div className="heading">
                        <h2 className="sub-title"> Membership Contribution</h2>
                         <div className="sub-description">Please enter an amount.</div>
                    </div>
                    <div className={this.validationErrorClass('totalAmount')}>
                        <label>$AUD</label>
                        <input type="text" defaultValue="50" name="totalAmount" id="totalAmount" onChange={this.handleAmountChanged}/>
                    </div>
                </div>
                <div className="navigation">
                    <Button type="button" disabled={this.state.continueButtonDisabled} id="payment-continue-button"
                            onClick={this.processPayment} textContent="Continue" />
                </div>
            </div>
        </fieldset>)
    }
}
