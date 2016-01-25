import React, {Component} from 'react';
import Errors from './Errors.jsx';
import * as memberValidator from '../lib/memberValidator';
import countrySelector from '../public/javascript/countries.js';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.submitDetails = this.submitDetails.bind(this);
        this.getPersonalInformationSubtitletext = this.getPersonalInformationSubtitletext.bind(this);
        this.getResidentialAddressSubtitleText = this.getResidentialAddressSubtitleText.bind(this);
        this.handlePostalAddress = this.handlePostalAddress.bind(this);
        this.handleValidationErrors = this.handleValidationErrors.bind(this);
        this.validationErrorClass = this.validationErrorClass.bind(this);
        this.validator = memberValidator;
        this.state = {
            invalidFields: [],
            errorMessages: [],
            showPostalAddress: false
        };
    }

    handlePostalAddress() {
        if (this.refs.differentPostal.checked) {
            this.setState({showPostalAddress: true});
        } else {
            this.setState({showPostalAddress: false});
        }
    }

    handleValidationErrors(validationErrors) {
        var errors = [];
        let errorMessages = {
            firstName: "First Name: Please enter a valid first name. No numbers or symbols allowed.",
            lastName: "Last Name: Please enter a valid last name. No numbers or symbols allowed.",
            dateOfBirth: "Date Of Birth: Date of birth must be in format DD/MM/YYY and be over 16 years of age.",
            email: "Email: Please enter a valid email address i.e. valid@email.com",
            primaryPhoneNumber: "Number: Phone number must begin with a '0' or '+61' and be 9-10 digits in length.",
            secondaryPhoneNumber: "Number: Phone number must begin with a '0' or '+61' and be 9-10 digits in length.",
            residentialAddress: "Residential Address: Please enter an address",
            residentialState: "Residential State: Please select a state from the dropdown menu.",
            residentialCountry: "Residential Country: Please select a country from the dropdown menu.",
            residentialPostcode: "Residential Postcode: Please enter a postcode. Must be 4 digits in length and using only numbers.",
            residentialSuburb: "Residential Suburb: Please enter a suburb.",
            postalAddress: "Postal Address: Please enter an address",
            postalState: "Postal State: Please select a state from the dropdown menu.",
            postalCountry: "Postal Country: Please select a country from the dropdown menu.",
            postalPostcode: "Postal Postcode: Please enter a postcode. Must be 4 digits in length and using only numbers.",
            postalSuburb: "Postal Suburb: Please enter a suburb."
        };

        _.forEach(validationErrors, function(error){
            errors.push(errorMessages[error]);
        });
        this.setState({invalidFields: validationErrors});
        this.setState({errorMessages: errors});

    }

    componentDidMount() {
        countrySelector.populateCountries("residentialAddress[country]", "residentialAddress[state]");
        countrySelector.populateCountries("postalAddress[country]", "postalAddress[state]");

        countrySelector.setCountryAddress("residentialAddress[country]", this.props.formValues.residentialAddress.country, "residentialAddress[state]", this.props.formValues.residentialAddress.state);
        countrySelector.setCountryAddress("postalAddress[country]", this.props.formValues.postalAddress.country, "postalAddress[state]", this.props.formValues.postalAddress.state);
    }

    getPersonalInformationSubtitletext() {
        if (this.props.membershipType === "full") {
            return "Please enter your details exactly as they would appear on the electoral roll.";
        }
        return "Please enter your details";
    }

    getResidentialAddressSubtitleText() {
        if (this.props.membershipType === "full") {
            return "Please enter the address that you are enrolled to vote from.";
        }
        return "Please enter your address";
    }

    validationErrorClass(fieldName) {
        if(_.indexOf(this.state.invalidFields, fieldName) > -1){
            return 'invalid';
        }
        return ;
    }


    submitDetails() {
        var fieldValues = {
            membershipType: this.props.membershipType,
            firstName: this.refs.firstName.value,
            lastName: this.refs.lastName.value,
            dateOfBirth: this.refs.dateOfBirth.value,
            gender: this.refs.gender.value,
            email: this.refs.email.value,
            primaryPhoneNumber: this.refs.phoneNumber.value,
            secondaryPhone: this.refs.secondaryPhone.value,
            residentialAddress: {
                address: this.refs.residentialAddress.value,
                suburb: this.refs.residentialSuburb.value,
                country: this.refs.residentialCountry.value,
                state: this.refs.residentialState.value,
                postcode: this.refs.residentialPostcode.value
            },
            postalAddress: {
                address: this.refs.postalAddress.value,
                suburb: this.refs.postalSuburb.value,
                country: this.refs.postalCountry.value,
                state: this.refs.postalState.value,
                postcode: this.refs.postalPostcode.value
            }
        };

        if (!this.refs.differentPostal.checked) {
            fieldValues.postalAddress = fieldValues.residentialAddress;
        }
        var validationErrors = this.validator.isValid(fieldValues);
        if (validationErrors.length > 0) {
            this.handleValidationErrors(validationErrors);
            return;
        }
        return this.props.saveAndContinue(fieldValues);
    }

    render() {
        return (
            <fieldset>
                <h1 className="form-title">Details</h1>

                <div className="form-body">
                    <Errors invalidFields={this.state.errorMessages}/>

                    <div className="reminder">
                        <img src="/images/reminder.svg"></img>

                        <div className="reminder-text">
                            The information provided in this form may be used for the purpose of ensuring that the
                            Pirate Party can register or remain registered as a political party in Australia, and its
                            states and territories. <a href="/">View our Privacy Policy.</a>
                        </div>
                    </div>
                    <div className="heading">
                        <h2 className="sub-title"> Personal Information</h2>
                        <i>{this.getPersonalInformationSubtitletext()}</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="firstName" className={this.validationErrorClass('firstName')}>Given Name(s)*</label>
                        <input type="text" defaultValue={this.props.formValues.firstName} ref="firstName" id="firstName"
                               className="firstName" />
                        <label htmlFor="lastName" className={this.validationErrorClass('lastName')}>Surname*</label>
                        <input type="text" defaultValue={this.props.formValues.lastName} ref="lastName" id="lastName"
                               className="lastName"/>
                        <label htmlFor="dateOfBirth" className={this.validationErrorClass('dateOfBirth')}>Date of Birth*</label>
                        <input type="text" defaultValue={this.props.formValues.dateOfBirth} ref="dateOfBirth"
                               placeholder="DD/MM/YYYY" id="dateOfBirth" className="dateOfBirth"/>
                        <label htmlFor="gender" className={this.validationErrorClass('gender')}>Gender</label>
                        <input type="text" defaultValue={this.props.formValues.gender} ref="gender" id="gender"
                               className="gender"/>
                    </div>
                    <div className="heading">
                        <h2 className="sub-title"> Residential Address</h2>
                        <i>{this.getResidentialAddressSubtitleText()}</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="residentialAddress[address]" className={this.validationErrorClass('residentialAddress')}>Address*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.address} ref="residentialAddress" id="residentialAddress[address]" className="residentialAddress" />
                        <label htmlFor="residentialAddress[suburb]" className={this.validationErrorClass('residentialSuburb')}>Suburb/City*</label>
                        <input type="text" defaultValue={this.props.formValues.residentialAddress.suburb} ref="residentialSuburb" id="residentialAddress[suburb]" className="residentialSuburb" />
                        <label htmlFor="residentialAddress[country]" className={this.validationErrorClass('residentialCountry')}>Country*</label>
                        <select defaultValue={this.props.formValues.residentialAddress.country} ref="residentialCountry"
                                id="residentialAddress[country]" className="residentialCountry">
                        </select>

                        <div className="state-code">
                            <label htmlFor="residentialAddress[state]" className={this.validationErrorClass('residentialState')}>State*</label>
                            <select defaultValue={this.props.formValues.residentialAddress.state} ref="residentialState"
                                    id="residentialAddress[state]" className="residentialState">
                                <option value="New South Wales">New South Wales</option>
                            </select>
                            <label htmlFor="residentialAddress[postcode]" className={this.validationErrorClass('residentialPostcode')}>Postcode*</label>
                            <input type="text" defaultValue={this.props.formValues.residentialAddress.postcode}
                                   ref="residentialPostcode" id="residentialAddress[postcode]"
                                   className="residentialPostcode"/>
                        </div>
                        <label>
                            <input type="checkbox" onChange={this.handlePostalAddress}
                                   defaultValue={this.props.formValues.differentPostal} ref="differentPostal"
                                   value="Yes"/>
                            My residential address differs from my postal address.
                        </label>
                    </div>
                    <div id="postal-address"
                         className={(() => { return this.state.showPostalAddress ? '' : 'hidden';})()}>
                        <div className="heading">
                            <h2 className="sub-title"> Postal Address</h2>
                            <i>Please enter the postal address.</i>
                        </div>
                        <div className="field-group">
                            <label htmlFor="postalAddress[address]" className={this.validationErrorClass('postalAddress')}>Address*</label>
                            <input type="text" defaultValue={this.props.formValues.postalAddress.address}
                                   ref="postalAddress" id="postalAddress"/>
                            <label htmlFor="postalAddress[suburb]" className={this.validationErrorClass('postalSuburb')}>Suburb*</label>
                            <input type="text" defaultValue={this.props.formValues.postalAddress.suburb}
                                   ref="postalSuburb" id="postalAddress[suburb]"/>
                            <label htmlFor="postalAddress[country]" className={this.validationErrorClass('postalCountry')}>Country*</label>
                            <select defaultValue={this.props.formValues.postalAddress.country} ref="postalCountry"
                                    id="postalAddress[country]">
                            </select>

                            <div className="state-code">
                                <label htmlFor="postalAddress[state]" className={this.validationErrorClass('postalState')}>State*</label>
                                <select defaultValue={this.props.formValues.postalAddress.state} ref="postalState"
                                        id="postalAddress[state]">
                                </select>
                                <label htmlFor="postalAddress[postcode]" className={this.validationErrorClass('postalPostcode')}>Postcode*</label>
                                <input type="text" defaultValue={this.props.formValues.postalAddress.postcode}
                                       ref="postalPostcode" id="postalAddress[postcode]"/>
                            </div>
                        </div>
                    </div>
                    <div className="heading">
                        <h2 className="sub-title"> Contact Details</h2>
                        <i>Please enter your current email and phone number.</i>
                    </div>
                    <div className="field-group">
                        <label htmlFor="email" className={this.validationErrorClass('email')}>Email*</label>
                        <input type="text" defaultValue={this.props.formValues.email} ref="email" id="email"
                               className="email"/>
                        <label htmlFor="phoneNumber" className={this.validationErrorClass('primaryPhoneNumber')}>Phone number*</label>
                        <input type="text" defaultValue={this.props.formValues.primaryPhoneNumber} ref="phoneNumber"
                               id="primaryPhoneNumber" className="primaryPhoneNumber"/>
                        <label htmlFor="phoneNumber" className={this.validationErrorClass('secondaryPhoneNumber')}>Secondary Phone</label>
                        <input type="text" defaultValue={this.props.formValues.secondaryPhone} ref="secondaryPhone"
                               id="secondaryPhone" className="secondaryPhone"/>
                    </div>
                    <div className="navigation">
                        <button onClick={this.submitDetails}>Continue</button>
                        <p>or <a id="go-back" onClick={this.props.previousStep}>go back</a></p>
                    </div>
                </div>
            </fieldset>
        )
    }

;
}
