import React, {Component} from 'react';

export default class Payment extends Component {
    constructor(props) {
        super(props);
        this.showStripePopup = this.showStripePopup.bind(this);

    }

    showStripePopup() {
        console.log("onclick happening");
        e.preventDefault();
    }

    render() {
        return <div id="payment-form">
            <h1>Pay What You Want</h1>
            <div className="form-body">
                <div className="reminder">
                    <img src="/images/reminder.svg"/>
                    <div className="reminder-text">
                        <b>Full Membership</b> of Pirate Party Australia is currently <b>Whatever you want!</b>
                    </div>
                </div>
                <div className="contribution">
                    <div className="heading">
                        <h2>Membership Contribution</h2>
                        <i>Please enter a whole dollar value (minimum $0)</i>
                    </div>
                    <div className="contribution-amount">
                        <div className="currency">$AUD</div>
                        <input type="text" name="totalAmount" id="totalAmount"/>
                        <input className="hidden" type="text" name="memberEmail" id="memberEmail"
                               defaultValue={this.props.email}/>
                    </div>
                </div>
                <div className="payment-method">
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
                        <button type="button" id="pay-by-credit-card-button" onClick={this.showStripePopup}>Credit/Debit Card</button>
                    </div>
                </div>
                <div className="navigation">
                    <button type="button" className="hidden" id="payment-continue-button">Continue</button>
                    <p>or <a id="payment-go-back">go back</a></p>
                </div>
            </div>
        </div>;

    }
}