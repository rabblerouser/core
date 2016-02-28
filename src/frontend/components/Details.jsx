import React, {Component} from 'react';
import Errors from './Errors.jsx';
import * as memberValidator from '../services/memberValidator';
import countrySelector from '../../../public/javascript/countries.js';
import { ApplictionFormValidationErrors as ErrorStrings } from '../config/strings.js';
import { ApplicationForm as Strings } from '../config/strings.js';
import FormFieldLabel from './form/FormFieldLabel.jsx';
import labService from '../services/labService';
import memberAdapter from '../adapters/memberAdapter';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.submitDetails = this.submitDetails.bind(this);
        this.handleValidationErrors = this.handleValidationErrors.bind(this);
        this.isValidationError = this.isValidationError.bind(this);
        this.render = this.render.bind(this);
        this.validator = memberValidator;
        this.state = {
            invalidFields: [],
            errorNames: [],
            labs: []
        };

        this.errorTypes = {
          contactName: ErrorStrings.contactName,
          contactNumber: ErrorStrings.contactNumber,
          childBirthYear: ErrorStrings.childBirthYear,
          contactEmail: ErrorStrings.contactEmail,
          childName: ErrorStrings.childName,
          labSelection: ErrorStrings.labSelection,
          schoolType: ErrorStrings.schoolType
        };
    }

    componentDidMount() {
      labService.getLabList()
        .then( (labs) => {
          this.setState({labs: labs});
        })
        .catch( () => {
          this.setState({labs: []});
        });
    }

    handleValidationErrors(validationErrors, scrollToError) {
        let invalidFields = validationErrors;
        var errors = [];

        _.forEach(invalidFields, function(error){
            errors.push(this.errorTypes[error].name);
        }.bind(this));

        this.setState({invalidFields: invalidFields, errorNames: errors, scrollToError: scrollToError});
    }

    isValidationError(fieldName) {
      return _.indexOf(this.state.invalidFields, fieldName) > -1;
    }

    getSchoolType(refs) {
      if (refs.schoolTypePrimary.checked) {
        return refs.schoolTypePrimary.value;
      }
      if (refs.schoolTypeSecondary.checked) {
        return refs.schoolTypeSecondary.value;
      }
      if (refs.schoolTypeOther.checked) {
        return refs.schoolTypeOtherText.value;
      }
      return '';
    }

    submitDetails() {

        var fieldValues = {
            labSelection: this.refs.labSelection.value,
            contactName: this.refs.contactName.value,
            contactLastName: this.refs.contactLastName.value,
            contactNumber: this.refs.contactNumber.value,
            contactEmail: this.refs.contactEmail.value,
            childName: this.refs.childName.value,
            childLastName: this.refs.childLastName.value,
            childBirthYear: this.refs.childBirthYear.value,
            schoolType: this.getSchoolType(this.refs),
            additionalInfo: this.refs.additionalInfo.value
        };

        var validationErrors = this.validator.isValid(fieldValues);
        if (validationErrors.length > 0) {
            this.handleValidationErrors(validationErrors, true);
            return;
        }
        let payload = memberAdapter.prepareNewMemberPayload(fieldValues);
        return this.props.postAndContinue(payload);
    }

    render() {
        return (
            <fieldset>
                <h1 className="form-title">Details</h1>

                <div className="form-body">
                    <Errors invalidFields={this.state.errorNames}
                            scrollToError={this.state.scrollToError}
                            errorTitle="Please check the following fields:"/>

                    <div className="heading">
                        <h2 className="sub-title"> Personal Information</h2>
                        <div className="sub-description">{Strings.instructions}</div>
                    </div>
                    <div className="field-group">
                        <FormFieldLabel fieldName="labSelection" isOptional={false} hasError={this.isValidationError('labSelection')} />
                        <aside>{ Strings.byoReminder }</aside>
                        <select ref="labSelection" defaultValue="" required id="labSelection" className="labSelection">
                            <option value="" disabled>{Strings.labPlaceholder}</option>
                            {
                              this.state.labs.map(function(lab) {
                                return <option value={lab.key}>{lab.name}</option>;
                              })
                            }
                        </select>

                        <FormFieldLabel fieldName="contactName" isOptional={false} hasError={this.isValidationError('contactName')} />
                        <fieldset className="field-pair">
                          <div className="sub-field">
                            <label>First name</label>
                            <input type="text" defaultValue={this.props.formValues.contactName} ref="contactName" id="contactName" className="contactName" />
                          </div>
                          <div className="sub-field">
                            <label>Last name</label>
                            <input type="text" defaultValue={this.props.formValues.contactLastName} ref="contactLastName" id="contactLastName" className="contactLastName" />
                          </div>
                        </fieldset>

                        <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={this.isValidationError('contactNumber')} />
                        <input type="tel" defaultValue={this.props.formValues.contactNumber} ref="contactNumber" id="contactNumber" className="contactNumber"/>

                        <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={this.isValidationError('contactEmail')} />
                        <input type="email" defaultValue={this.props.formValues.contactEmail} ref="contactEmail" id="contactEmail" className="contactEmail"/>

                        <FormFieldLabel fieldName="childName" isOptional={false} hasError={this.isValidationError('childName')} />
                        <fieldset className="field-pair">
                          <div className="sub-field">
                            <label>First name</label>
                            <input type="text" defaultValue={this.props.formValues.childName} ref="childName" id="childName" className="childName"/>
                          </div>
                          <div className="sub-field">
                            <label>Last name</label>
                            <input type="text" defaultValue={this.props.formValues.childLastName} ref="childLastName" id="childLastName" className="childLastName"/>
                          </div>
                        </fieldset>

                        <FormFieldLabel fieldName="childBirthYear" isOptional={false} hasError={this.isValidationError('childBirthYear')} />
                        <aside>{ Strings.ageReminder }</aside>
                        <input type="number" defaultValue={this.props.formValues.childBirthYear} ref="childBirthYear" placeholder="YYYY" min="1980" max="2016" id="childBirthYear" className="childBirthYear"/>

                        <FormFieldLabel fieldName="schoolType" isOptional={false} hasError={this.isValidationError('schoolType')} />
                        <div><input type="radio" name="schoolType" ref="schoolTypePrimary" value="Primary"/>Primary</div>
                        <div><input type="radio" name="schoolType" ref="schoolTypeSecondary" value="Secondary"/>Secondary</div>
                        <div><input type="radio" name="schoolType" ref="schoolTypeOther" value="Other"/>Other
                          <input type="text" defaultValue={this.props.formValues.schoolType} ref="schoolTypeOtherText" id="schoolTypeOtherText" className="other-field"/>
                        </div>

                        <FormFieldLabel fieldName="additionalInfo" isOptional={true} hasError={this.isValidationError('additionalInfo')} />
                        <textarea defaultValue={this.props.formValues.additionalInfo} ref="additionalInfo" id="additionalInfo" className="additionalInfo"/>
                      </div>

                    <div className="navigation">
                        <button onClick={this.submitDetails}>Register</button>
                        <p>or <a id="go-back" onClick={this.props.previousStep} href="#">go back</a></p>
                    </div>
                </div>
            </fieldset>
        )
    }
}
