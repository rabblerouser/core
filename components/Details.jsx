import React, {Component} from 'react';
import * as memberValidator from '../lib/memberValidator';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.submitDetails = this.submitDetails.bind(this);
        this.validator = memberValidator;
        this.state = { }
    }

    submitDetails() {
        var fieldValues = {
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
            dateOfBirth: this.refs.dateOfBirth.value,
            gender: this.refs.gender.value,
            email: this.refs.email.value,
            phoneNumber: this.refs.phoneNumber.value,
            secondaryPhone: this.refs.secondaryPhone.value,
            residentialAddress: {
                address: 1,
                suburb: 1,
                country: 1,
                state: 1,
                postcode: 1
            },
            postalAddress: {

            }
        };
        var validationErrors = this.validator.isValid(fieldValues);
        if (validationErrors) {
            return this.setState({validationErrors: validationErrors });
        }
        return this.props.saveAndContinue(fieldValues);
    }

    render() {
        return (
            <div id="details-form">
                <h1>Details</h1>
                <p className="error">{this.state.validationErrors}</p>
                <div className="form-body">
                    <div className="reminder">
                        <img src="/images/reminder.svg"></img>
                        <div className="reminder-text">
                            This information will be used for the purposes of registering a political party with the
                            Australian Electoral Commission. <a href="/">View our Privacy Policy.</a>
                        </div>
                    </div>
                    <div className="heading">
                        <h2>Personal Information</h2>
                        <i>Please enter your details exactly as they would appear on the electoral roll.</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="firstName">Given Name(s)*</label>
                        <input type="text" defaultValue={this.props.formValues.firstName} ref="firstName"/>
                        <label htmlFor="lastName">Surname*</label>
                        <input type="text" defaultValue={this.props.formValues.lastName} ref="lastName"/>
                        <label htmlFor="dateOfBirth">Date of Birth*</label>
                        <input type="text" defaultValue={this.props.formValues.dateOfBirth} ref="dateOfBirth" placeholder="DD/MM/YYYY"/>
                        <label htmlFor="gender">Gender</label>
                        <input type="text" defaultValue={this.props.formValues.gender} ref="gender"/>
                    </div>
                    <div className="heading">
                        <h2>Residential Address</h2>
                        <i>Please enter the address that you are enrolled to vote from with the AEC.</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="residentialAddress[address]">Address*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.address} ref="residentialAddress[address]"/>
                        <label htmlFor="residentialAddress[suburb]">Suburb*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.suburb} ref="residentialAddress[suburb]"/>
                        <label htmlFor="residentialAddress[country]">Country*</label>
                        <select defaultValue={this.props.formValues.residentialAddress.country} ref="residentialAddress[country]"></select>

                        <div className="state-code">
                            <label htmlFor="residentialAddress[state]">State*</label>
                            <select defaultValue={this.props.formValues.residentialAddress.state} ref="residentialAddress[state]"></select>
                            <label htmlFor="residentialAddress[postcode]">Postcode*</label>
                            <input type="text" defaultValue={this.props.formValues.residentialAddress.postcode} ref="residentialAddress[postcode]"/>
                        </div>
                        <label>
                            <input type="checkbox" defaultValue={this.props.formValues.differentPostal} ref="differentPostal" value="true"/>
                            My residential address differs from my postal address.
                        </label>
                    </div>
                    <div id="postal-address">
                        <div className="heading">
                            <h2>Postal Address</h2>
                            <i>Please enter the postal address.</i>
                        </div>
                        <div className="field-group">
                            <input type="text" defaultValue={this.props.formValues.postalAddress.address} ref="postalAddress[address]"/>
                            <label htmlFor="postalAddress[suburb]">Suburb*</label>
                            <input type="text" defaultValue={this.props.formValues.postalAddress.suburb} ref="postalAddress[suburb]"/>
                            <label htmlFor="postalAddress[country]">Country*</label>
                            <select defaultValue={this.props.formValues.postalAddress.country} ref="postalAddress[country]"></select>

                            <div className="state-code">
                                <label htmlFor="postalAddress[state]">State*</label>
                                <select defaultValue={this.props.formValues.postalAddress.state} ref="postalAddress[state]"></select>
                                <label htmlFor="postalAddress[postcode]">Postcode*</label>
                                <input type="text" defaultValue={this.props.formValues.postalAddress.postcode} ref="postalAddress[postcode]"/>
                                <label htmlFor="postalAddress[address]">Address*</label>
                            </div>
                        </div>
                    </div>
                    <div className="heading">
                        <h2>Contact Details</h2>
                        <i>Please enter your current email and phone number.</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email">Email*</label>
                        <input type="text" defaultValue={this.props.formValues.email} ref="email"/>
                        <label htmlFor="phoneNumber">Phone number*</label>
                        <input type="text" defaultValue={this.props.formValues.primaryPhoneNumber} ref="phoneNumber"/>
                        <label htmlFor="phoneNumber">Secondary Phone</label>
                        <input type="text" defaultValue={this.props.formValues.secondaryPhone} ref="secondaryPhone"/>
                    </div>
                    <div className="navigation">
                        <button onClick={this.submitDetails} type="submit">Continue</button>
                    </div>
                </div>
            </div>
        )
    };
}