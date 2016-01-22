import React, {Component} from 'react';
import Errors from './Errors.jsx';
import FullMemberDeclarationText from './declaration-text/FullMemberDeclarationText.jsx';
import OtherMemberDeclarationText from './declaration-text/OtherMemberDeclarationText.jsx';

export default class ConfirmDetails extends Component {
    constructor(props) {
        super(props);
        this.getFullAddress = this.getFullAddress.bind(this);
        this.submitMember = this.submitMember.bind(this);
        this.getDeclaration = this.getDeclaration.bind(this);
        this.state = {
            errors: []
        };
    }

    getFullAddress(addressObj){
        return addressObj.address + ', '
            + addressObj.suburb + ', '
            + addressObj.state + ', '
            + addressObj.country + ', '
            + addressObj.postcode;
    }

    submitMember() {
        if(this.refs.declarationConfirmation.checked) {
            this.props.postAndContinue(this.props.formValues);
        }
        else {
            this.setState({errors:["Please confirm your details and click the checkbox before continuing."]});
        }
    }

    getDeclaration() {
      if(this.props.formValues.membershipType === 'full'){
          return <FullMemberDeclarationText />;
      }
      return <OtherMemberDeclarationText />;
    }

    render() {
        return <fieldset>
            <h1 className="form-title">Confirm</h1>

            <div className="form-body">
                <Errors invalidFields={this.state.errors} />
                <div className="heading">
                    <h2 className="sub-title">Declaration </h2>
                    <i> Read the following and click the checkbox below.</i>
                </div>
                <div className="declaration">
                  {this.getDeclaration()}
                </div>
                <label className="confirmationLabel">
                    <input type="checkbox" name="circumstance" ref="declarationConfirmation"/>
                    I confirm that I am enrolled to vote in federal elections and consent to my information being sent
                    to the Australia Electoral Commission.<span className="mandatoryField">* </span>
                </label>
                <div className="heading">
                    <h2 className="sub-title">Check Your Details</h2>
                    <i>Please enter all the data you have entered is correct. It is a serious offence to make a false declaration.</i>
                </div>
                <div className="declaration">
                    <div className="declaration-text">
                        <b> Name: </b> {this.props.formValues.firstName} {this.props.formValues.lastName} <br/>
                        <b> DOB: </b> {this.props.formValues.dateOfBirth} <br/>
                        <b> Gender: </b> {this.props.formValues.gender} <br/>
                        <b> Residential Address: </b> {this.getFullAddress(this.props.formValues.residentialAddress)} <br/>
                        <b> Postal Address: </b> {this.getFullAddress(this.props.formValues.postalAddress)} <br/>
                        <b> Email: </b> {this.props.formValues.email} <br/>
                        <b> Phone: </b> {this.props.formValues.primaryPhoneNumber} <br/>
                    </div>
                </div>
                <div className="navigation">
                    <button onClick={this.submitMember}>My details are correct</button>
                    <p>or <a id="go-back" onClick={this.props.previousStep}>go back to change your details</a></p>
                </div>
            </div>
        </fieldset>
    }
}
