import React, {Component} from 'react';

export default class ConfirmDetails extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <p>
          A copy of your receipt has also been emailed to you. To view the details of
          this transaction, please visit <a href="https://paypal.com" target="_blank">paypal.com</a>.
        </p>;
    }
}
