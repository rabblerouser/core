import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Errors from './Errors.jsx';
var scriptLoader = require('load-script').bind(this);

export default class StripePayment extends Component {
    constructor(props) {
        super(props);
        this.paypalDisabled = false;
        this.paypalHandler = null;
        this.checkout = this.checkout.bind(this);
        this.render = this.render.bind(this);

    }
    checkout(amount) {
      document.getElementById("paymentAmount").value = amount;
      document.getElementById("paypalForm").submit();
  };

  render() {
      if (this.paypalDisabled) {
          console.log("paypal disabled");
          return;
      }

      return <label>
          <input type="radio" name="paymentType" value="paypal" onChange={this.props.onChange}/>
          PayPal
          <form className="hidden" id="paypalForm" action="https://www.sandbox.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_xclick"/>
              <input type="hidden" name="business" value="cdodd@thoughtworks.com"/>
              <input type="hidden" name="lc" value="AU"/>
              <input type="hidden" name="item_name" value="Pirate Party membership"/>
              <input type="hidden" name="item_number" value="1"/>
              <input type="hidden" name="amount" id="paymentAmount" value="50"/>
              <input type="hidden" name="currency_code" value="AUD"/>
              <input type="hidden" name="button_subtype" value="services"/>
              <input type="hidden" name="no_note" value="0"/>
              <input type="hidden" name="bn" value="PP-BuyNowBF:btn_paynowCC_LG.gif:NonHostedGuest"/>
              <input type="hidden" src="https://www.paypalobjects.com/en_AU/i/btn/btn_paynowCC_LG.gif" border="0" id="paypalSubmit" alt="PayPal — The safer, easier way to pay online."/>
              <img alt="" border="0" src="https://www.paypalobjects.com/en_AU/i/scr/pixel.gif" width="1" height="1"/>
              <input type="hidden" name="return" value="http://localhost:3000"/>
          </form>
        </label>;
  };
};
