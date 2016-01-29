import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Errors from './Errors.jsx';
var scriptLoader = require('load-script').bind(this);

export default class PaypalPayment extends Component {
    constructor(props) {
        super(props);
        this.state = {mounted: false};
        this.paypalDisabled = true;
        this.paypalHandler = null;
        this.checkout = this.checkout.bind(this);
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);

        this.loadPaypal();

    }
    componentDidMount () {
        this.setState({mounted: true});
    }

    loadPaypal() {
        var req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.onreadystatechange = function() {
          this.paypalServerUrl = req.getResponseHeader('Paypal-Server-Url');
          this.paypalReturnUrl = req.getResponseHeader('Paypal-Return-Url');
          this.paypalEmail = req.getResponseHeader('Paypal-Email');

          if (!this.paypalServerUrl || this.paypalServerUrl === 'undefined' ||
              !this.paypalReturnUrl || this.paypalReturnUrl === 'undefined' ||
              !this.paypalEmail || this.paypalEmail === 'undefined') {
              this.paypalDisabled = true;
              console.log('paypal disabled');
              if(this.state.mounted) {
                  this.forceUpdate();
              }
              return;
          }
        }.bind(this);
        req.send(null);
    }

    checkout(amount) {
      document.getElementById('paymentAmount').value = amount;
      document.getElementById('paypalForm').submit();
    }

  render() {
      if (this.paypalDisabled) {
          return null;
      }

      return <label>
          <input type="radio" name="paymentType" value="paypal" onChange={this.props.onChange}/>
          PayPal
          <form className="hidden" id="paypalForm" action={this.paypalServerUrl} method="post" target="_top">
              <input type="hidden" name="cmd" value="_xclick"/>
              <input type="hidden" name="business" value={this.paypalEmail}/>
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
              <input type="hidden" name="return" value={this.paypalReturnUrl}/>
          </form>
        </label>;
  };
};
