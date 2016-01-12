import React, {Component} from 'react';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.submitDetails = this.submitDetails.bind(this);
    }

    submitDetails() {

    }

    render() {
        return (
            <div id="details-form">
                <h1>Details</h1>

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
                        <input type="text" defaultValue={this.props.formValues.firstName} id="firstName"/>
                        <label htmlFor="lastName">Surname*</label>
                        <input type="text" defaultValue={this.props.formValues.lastName} id="lastName"/>
                        <label htmlFor="dateOfBirth">Date of Birth*</label>
                        <input type="text" defaultValue={this.props.formValues.dateOfBirth} id="dateOfBirth" placeholder="DD/MM/YYYY"/>
                        <label htmlFor="gender">Gender</label>
                        <input type="text" defaultValue={this.props.formValues.gender} id="gender"/>
                    </div>
                    <div className="heading">
                        <h2>Residential Address</h2>
                        <i>Please enter the address that you are enrolled to vote from with the AEC.</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="residentialAddress[address]">Address*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.address} id="residentialAddress[address]"/>
                        <label htmlFor="residentialAddress[suburb]">Suburb*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.suburb} id="residentialAddress[suburb]"/>
                        <label htmlFor="residentialAddress[country]">Country*</label>
                        <select defaultValue={this.props.formValues.residentialAddress.country} id="residentialAddress[country]"></select>

                        <div className="state-code">
                            <label htmlFor="residentialAddress[state]">State*</label>
                            <select defaultValue={this.props.formValues.residentialAddress.state} id="residentialAddress[state]"></select>
                            <label htmlFor="residentialAddress[postcode]">Postcode*</label>
                            <input type="text" defaultValue={this.props.formValues.residentialAddress.postcode}
                                   id="residentialAddress[postcode]"/>
                        </div>
                        <label>
                            <input type="checkbox" defaultValue={this.props.formValues.differentPostal} id="differentPostal" value="true"/>
                            My residential address differs from my postal address.
                        </label>
                    </div>
                    <div id="postal-address">
                        <div className="heading">
                            <h2>Postal Address</h2>
                            <i>Please enter the postal address.</i>
                        </div>
                        <div className="field-group">
                            <input type="text" defaultValue={this.props.formValues.postalAddress.address} id="postalAddress[address]"/>
                            <label htmlFor="postalAddress[suburb]">Suburb*</label>
                            <input type="text" defaultValue={this.props.formValues.postalAddress.suburb} id="postalAddress[suburb]"/>
                            <label htmlFor="postalAddress[country]">Country*</label>
                            <select defaultValue={this.props.formValues.postalAddress.country} id="postalAddress[country]"></select>

                            <div className="state-code">
                                <label htmlFor="postalAddress[state]">State*</label>
                                <select defaultValue={this.props.formValues.postalAddress.state} id="postalAddress[state]"></select>
                                <label htmlFor="postalAddress[postcode]">Postcode*</label>
                                <input type="text" defaultValue={this.props.formValues.postalAddress.postcode} id="postalAddress[postcode]"/>
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
                        <input type="text" defaultValue={this.props.formValues.email} id="email"/>
                        <label htmlFor="phoneNumber">Phone number*</label>
                        <input type="text" defaultValue={this.props.formValues.primaryPhoneNumber} id="phoneNumber"/>
                        <label htmlFor="phoneNumber">Secondary Phone</label>
                        <input type="text" defaultValue={this.props.formValues.secondaryPhone} id="secondaryPhone"/>
                    </div>
                    <div className="navigation">
                        <button type="submit" className="hidden" id="details-continue-button">Continue</button>
                        <p>or <a className="hidden" id="details-go-back">go back</a></p>
                    </div>
                </div>
            </div>
        )
    }

;
}