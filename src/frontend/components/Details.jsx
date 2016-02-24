import React, {Component} from 'react';
import Errors from './Errors.jsx';
import InlineError from './InlineError.jsx';
import * as memberValidator from '../../lib/memberValidator';
import countrySelector from '../../../public/javascript/countries.js';
import { ApplictionFormValidationErrors as ErrorStrings } from '../config/strings.js';
import { ApplicationFormFieldLabels as Labels } from '../config/strings.js';
import { ApplicationForm as Strings } from '../config/strings.js';


export default class Details extends Component {
    constructor(props) {
        super(props);
        this.submitDetails = this.submitDetails.bind(this);
        this.handleValidationErrors = this.handleValidationErrors.bind(this);
        this.validationErrorClass = this.validationErrorClass.bind(this);
        this.isValidationError = this.isValidationError.bind(this);
        this.render = this.render.bind(this);
        this.validator = memberValidator;
        this.state = {
            invalidFields: [],
            errorNames: [],
            labs: ['Geelong', 'Melbourne', 'East Melbourne']
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

    validationErrorClass(fieldName) {
        if(this.isValidationError(fieldName)){
            return 'invalid';
        }
        return ;
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

        console.log(JSON.stringify(fieldValues));

        var validationErrors = this.validator.isValid(fieldValues);
        if (validationErrors.length > 0) {
            this.handleValidationErrors(validationErrors, true);
            return;
        }
        return this.props.saveAndContinue(fieldValues);
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

                        <label htmlFor="labSelection" className={this.validationErrorClass('labSelection')}>{Labels.labSelection}<span className="mandatoryField">* </span>
                            <InlineError isError={this.isValidationError('labSelection')}
                                          errorMessage={this.errorTypes['labSelection'].message} />
                        </label>
                        <select ref="labSelection" defaultValue="" required id="labSelection" className="labSelection">
                            <option value="" disabled>{Strings.labPlaceholder}</option>
                            {
                              this.state.labs.map(function(lab) {
                                return <option value={lab}>{lab}</option>;
                              })
                            }
                        </select>
                        <span>{ Strings.byoReminder }</span>

                        <label htmlFor="contactName" className={this.validationErrorClass('contactName')}>{Labels.contactName}<span className="mandatoryField">* </span>
                            <InlineError isError={this.isValidationError('contactName')}
                                          errorMessage={this.errorTypes['contactName'].message} />
                        </label>
                        <input type="text" defaultValue={this.props.formValues.contactName} ref="contactName" id="contactName" className="contactName" />
                        <input type="text" defaultValue={this.props.formValues.contactLastName} ref="contactLastName" id="contactLastName" className="contactLastName" />

                        <label htmlFor="contactNumber" className={this.validationErrorClass('contactNumber')}>{Labels.contactNumber}<span className="mandatoryField">* </span>
                          <InlineError isError={this.isValidationError('contactNumber')}
                                        errorMessage={this.errorTypes['contactNumber'].message} />
                        </label>
                        <input type="tel" defaultValue={this.props.formValues.contactNumber} ref="contactNumber" id="contactNumber" className="contactNumber"/>

                        <label htmlFor="contactEmail" className={this.validationErrorClass('contactEmail')}>{Labels.contactEmail}<span className="mandatoryField">* </span>
                            <InlineError isError={this.isValidationError('contactEmail')}
                                          errorMessage={this.errorTypes['contactEmail'].message} />
                        </label>
                        <input type="email" defaultValue={this.props.formValues.contactEmail} ref="contactEmail" id="contactEmail" className="contactEmail"/>

                        <label htmlFor="childName" className={this.validationErrorClass('childName')}>{Labels.childName}<span className="mandatoryField">* </span>
                            <InlineError isError={this.isValidationError('childName')}
                                          errorMessage={this.errorTypes['childName'].message} />
                        </label>
                        <input type="text" defaultValue={this.props.formValues.childName} ref="childName" id="childName" className="childName"/>
                        <input type="text" defaultValue={this.props.formValues.childLastName} ref="childLastName" id="childLastName" className="childLastName"/>

                        <label htmlFor="childBirthYear" className={this.validationErrorClass('childBirthYear')}>{Labels.childBirthYear}<span className="mandatoryField">* </span>
                          <InlineError isError={this.isValidationError('childBirthYear')}
                                        errorMessage={this.errorTypes['childBirthYear'].message} />
                        </label>
                        <input type="number" defaultValue={this.props.formValues.childBirthYear} ref="childBirthYear" placeholder="YYYY" min="1980" max="2016" id="childBirthYear" className="childBirthYear"/>

                        <label htmlFor="schoolType" className={this.validationErrorClass('schoolType')}>{Labels.schoolType}<span className="mandatoryField">* </span>
                            <InlineError isError={this.isValidationError('schoolType')}
                                          errorMessage={this.errorTypes['schoolType'].message} />
                        </label>

                        <input type="radio" name="schoolType" ref="schoolTypePrimary" value="Primary"/>Primary
                        <input type="radio" name="schoolType" ref="schoolTypeSecondary" value="Secondary"/>Secondary
                        <input type="radio" name="schoolType" ref="schoolTypeOther" value="Other"/>Other
                        <input type="text" defaultValue={this.props.formValues.schoolType} ref="schoolTypeOtherText" id="schoolType" className="schoolType"/>

                        <label htmlFor="additionalInfo" className={this.validationErrorClass('additionalInfo')}>{Labels.additionalInfo}
                        </label>
                        <textarea defaultValue={this.props.formValues.additionalInfo} ref="additionalInfo" id="additionalInfo" className="additionalInfo"/>

                      </div>

                    <div className="navigation">
                        <button onClick={this.submitDetails}>Continue</button>
                        <p>or <a id="go-back" onClick={this.props.previousStep} href="#">go back</a></p>
                    </div>
                </div>
            </fieldset>
        )
    }
}
