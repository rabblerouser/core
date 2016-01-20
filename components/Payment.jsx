import React, {Component} from 'react';
import Errors from './Errors.jsx';
import StripePayment from './StripePayment.jsx';
import $ from 'jquery';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.handleAmountChanged = this.handleAmountChanged.bind(this);
        this.handlePaymentTypeChanged = this.handlePaymentTypeChanged.bind(this);
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
          let stripeReference = this.refs.stripePayment;
          if (stripeReference.stripeDidError) {
              console.log('failed to load script');
          } else if (stripeReference.stripeDisabled) {
              console.log('Stripe has been disabled, could not find public key');
          } else if (stripeReference) {
              stripeReference.showStripeDialog();
          }
        } else if(this.state.paymentType === 'deposit' || this.state.paymentType === 'cheque')  {
          this.props.nextStep();
        }
        else {
          console.log("select one, we should put an validation msg for this");
        }
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
                        <StripePayment  ref="stripePayment"
                                        onChange={this.handlePaymentTypeChanged}
                                        setState={this.setState}
                                        email={this.props.email}
                                        amount={this.state.amount}/>
                </div>
                <div className="navigation">
                    <button type="button" id="payment-continue-button" onClick={this.processPayment}>Continue</button>
                </div>
            </div>
        </fieldset>)
    }
}
