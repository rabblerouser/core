import React, {Component} from 'react';
import {render} from 'react-dom';
import Errors from './Errors.jsx';

export default class Renew extends Component {

    constructor(props) {
        super(props);
        this.state = {user: '', errors: []};
    }

    componentDidMount() {
        var req = new XMLHttpRequest();
        req.open('GET', document.location, false);
        req.send(null);
        this.setState({user: JSON.parse(req.getResponseHeader('email'))});
    }

    getFullAddress(addressObj) {
        if (addressObj) {
            return addressObj.address + ', '
                + addressObj.suburb + ', '
                + addressObj.state + ', '
                + addressObj.country + ', '
                + addressObj.postcode;
        }
        return;
    }

    render() {
        return (
            <div className="container">
                <div id="form" className="form-container">
                    <div className="header">
                        <img src="/images/logo.svg"/>
                    </div>
                    <fieldset>
                        <h1 className="form-title">Renew Membership</h1>

                        <div className="form-body">
                            <Errors invalidFields={this.state.errors}
                                    scrollToError={true}/>


                            <div className="heading">
                                <h2 className="sub-title">Declaration </h2>

                                <div className="sub-description"> Read the following and click the checkbox below.</div>
                            </div>
                            <div className="declaration">
                                <p>
                                    I wish to renew my membership for Pirate Party Australia. I have read and understand
                                    the <b><a href="https://pirateparty.org.au/constitution/" target="_blank">Pirate
                                    Party Australia Constitution </a></b>
                                    and agree with its platform and principles, and to the best of my ability work to
                                    uphold and promote them.
                                </p>
                            </div>
                            <label className={this.state.errors.length > 0 ? "invalid" : ""} id="checkbox_declaration">
                                <input type="checkbox" name="circumstance" ref="declarationConfirmation"/>
                                <b>I consent to my information being
                                    sent
                                    to the Australian Electoral Commission.</b><span
                                className="mandatoryField">* </span>
                            </label>

                            <div className="heading">
                                <h2 className="sub-title">Your Details</h2>

                                <div className="sub-description">
                                    Check that your details are up to date.
                                </div>
                            </div>
                            <div className="declaration">
                                <div className="declaration-text">
                                    <b> Name: </b> {this.state.user.firstName} {this.state.user.lastName} <br/>
                                    <b> DOB: </b> {this.state.user.dateOfBirth} <br/>
                                    <b> Gender: </b> {this.state.user.gender} <br/>
                                    <b> Residential
                                        Address: </b> {this.getFullAddress(this.state.user.residentialAddress)}
                                    <br/>
                                    <b> Postal Address: </b> {this.getFullAddress(this.state.user.postalAddress)} <br/>
                                    <b> Email: </b> {this.state.user.email} <br/>
                                    <b> Phone: </b> {this.state.user.primaryPhoneNumber} <br/>
                                    <br/>
                                    <b> If you need to update your details, please contact the Pirate Party at <u>membership@pirateparty.org.au</u>
                                        after completing this form. </b>
                                </div>
                            </div>
                            <div className="navigation">
                                <button onClick={this.submitMember}>Renew my membership</button>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="footer">
                    <a href="https://pirateparty.org.au/privacy/" target="_blank">Privacy Policy</a>
                </div>
            </div>
        )
    }
}

render(<Renew />, document.getElementById('renew'));
