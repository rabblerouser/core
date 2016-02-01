import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PaypalInfoBox from './PaypalInfoBox.jsx';
import StripeInfoBox from './StripeInfoBox.jsx';
import DirectDebitInfoBox from './DirectDebitInfoBox.jsx';
import ChequeInfoBox from './ChequeInfoBox.jsx';
export default class PaymentInfo extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        // this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    // componentDidUpdate(toTopOfElement) {
    //     ReactDOM.findDOMNode(this).scrollIntoView(toTopOfElement);
    // }

    render() {
      console.log(this.props.paymentType);
      if(this.props.paymentType === 'paypal') {
          return <PaypalInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
      if(this.props.paymentType === 'creditOrDebitCard') {
          return <StripeInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
      if(this.props.paymentType === 'deposit') {
          return <DirectDebitInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }
      if(this.props.paymentType === 'cheque') {
          return <ChequeInfoBox
                  didUpdate={this.componentDidUpdate}/>;
      }

      return null;
    }
}
