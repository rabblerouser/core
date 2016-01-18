import React, {Component} from 'react';
import StripePayment from './StripePayment.jsx';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.handleAmountChanged = this.handleAmountChanged.bind(this);
        this.state = {amount : ''};
    }

    handleAmountChanged(event) {
        this.setState({amount: event.target.value});
    }

    render() {
        return <fieldset>
            <h1>Pay What You Want</h1>
            <div className="form-body">
                <div className="reminder">
                    <img src="/images/reminder.svg"/>
                    <div className="reminder-text">
                        <b>Full Membership</b> of Pirate Party Australia is currently <b>Whatever you want!</b>
                    </div>
                </div>
                <div className="heading">
                    <h2>Membership Contribution</h2>
                    <i>Please enter a whole dollar value (minimum $0)</i>
                </div>
                <div className="contribution-amount">
                    <div className="currency">$AUD</div>
                    <input type="text" name="totalAmount" id="totalAmount" onChange={this.handleAmountChanged}/>
                </div>
                <div className="heading">
                    <h2>Choose a Payment Method</h2>
                    <i>Pay your selected amount.</i>
                </div>
                <div className="field-group">
                    <label>
                        <input type="radio" name="paymentType" defaultValue="deposit"/>Direct Debit
                    </label>
                    <label>
                        <input type="radio" name="paymentType" defaultValue="cheque"/>Cheque
                    </label>
                    <StripePayment email={this.props.email}
                                   amount={this.state.amount} />
                </div>
                <div className="navigation">
                    <button type="button" id="payment-continue-button" onClick={this.props.nextStep}>Continue</button>
                    <p>or <a id="payment-go-back">go back</a></p>
                </div>
            </div>
        </fieldset>;
    }
}