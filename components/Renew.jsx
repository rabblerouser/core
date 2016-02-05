import React, {Component} from 'react';
import {render} from 'react-dom';
import Errors from './Errors.jsx';
import ConfirmRenewal from './ConfirmRenewal.jsx';
import Payment from './Payment.jsx';

export default class Renew extends Component {

    constructor(props) {
        super(props);
        this.confirmMembershipRenewal = this.confirmMembershipRenewal.bind(this);
        this.getForm = this.getForm.bind(this);
        this.state = {user: '', errors: [], step: 1};
    }

    componentDidMount() {
        var req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.send(null);
        this.setState({user: JSON.parse(req.getResponseHeader('email'))});
    }

    confirmMembershipRenewal() {
        //POST MEMBERSHIPRENEWAL
        this.setState({ step: this.state.step + 1});
    }

    getForm() {
        switch(this.state.step) {
            case 1:
                return <ConfirmRenewal nextStep={this.confirmMembershipRenewal}
                                       user={this.state.user} />;
            case 2:
                return <Payment email={this.state.user.email}
                                       invoiceId={this.invoiceId}
                                       nextStep={this.nextStep} />;
        };
    }

    render() {
        return (
            <div className="container">
                <div id="form" className="form-container">
                    <div className="header">
                        <img src="/images/logo.svg"/>
                    </div>
                    {this.getForm()}
                </div>
                <div className="footer">
                    <a href="https://pirateparty.org.au/privacy/" target="_blank">Privacy Policy</a>
                </div>
            </div>
        )
    }
}

render(<Renew />, document.getElementById('renew'));
