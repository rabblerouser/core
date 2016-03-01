import React, {Component} from 'react';
import Errors from './Errors.jsx';
import * as memberValidator from '../services/memberValidator';
import countrySelector from '../../../public/javascript/countries.js';
import { ApplictionFormValidationErrors as ErrorStrings } from '../config/strings.js';
import { ApplicationForm as Strings, Resources } from '../config/strings.js';
import FormFieldLabel from './form/FormFieldLabel.jsx';
import InlineError from './form/InlineError.jsx';

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
          contactLastName: ErrorStrings.contactLastName,
          contactNumber: ErrorStrings.contactNumber,
          participantBirthYear: ErrorStrings.participantBirthYear,
          contactEmail: ErrorStrings.contactEmail,
          participantName: ErrorStrings.participantName,
          participantLastName: ErrorStrings.participantLastName,
          labSelection: ErrorStrings.labSelection,
          schoolType: ErrorStrings.schoolType,
          additionalInfo: ErrorStrings.additionalInfo
        };
    }

    componentDidMount() {
      labService.getLabList()
        .then( (labs) => {
          this.setState({labs: labs});
        })
        .catch( () => {
          this.setState({errors: 'No labs',
                         errorTitle: Strings.remoteLabListErrorTitle});
        });

    }

    componentWillReceiveProps(props) {
      this.setState({ errors: props.errors,
                      errorTitle: props.errors });
    }

    handleValidationErrors(validationErrors, scrollToError) {
        let invalidFields = validationErrors;
        var errors = [];
        _.forEach(invalidFields, function(error){
            errors.push(this.errorTypes[error].name);
        }.bind(this));

        this.setState({ invalidFields: invalidFields,
                        errorNames: errors,
                        scrollToError: scrollToError,
                        errorTitle: Strings.validationErrorTitle});
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
            participantName: this.refs.participantName.value,
            participantLastName: this.refs.participantLastName.value,
            participantBirthYear: this.refs.participantBirthYear.value,
            schoolType: this.getSchoolType(this.refs),
            additionalInfo: this.refs.additionalInfo.value
        };

        this.setState({invalidFields: [], errorNames: [], errorTitle:''});
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
                            errorTitle={this.state.errorTitle}/>
                    <p>{Strings.instructions}</p>
                    <p><strong>{ Strings.byoReminder }</strong></p>
                    <div className="field-group">
                        <FormFieldLabel fieldName="labSelection" isOptional={false} hasError={this.isValidationError('labSelection')} />

                        <select ref="labSelection" defaultValue="" required id="labSelection" className="labSelection">
                            <option value="" disabled>{Strings.labPlaceholder}</option>
                            {
                              this.state.labs.map(function(lab) {
                                return <option value={lab.key}>{lab.name}</option>;
                              })
                            }
                        </select>

                        <fieldset className="field-pair">
                          <legend>Parent / Guardian name</legend>
                          <div className="sub-field">

                         <FormFieldLabel fieldName="contactName" isOptional={false} hasError={this.isValidationError('contactName')} />
                            <input type="text" defaultValue={this.props.formValues.contactName} ref="contactName" id="contactName" className="contactName" />
                          </div>
                          <div className="sub-field">
                           <FormFieldLabel fieldName="contactLastName" isOptional={false} hasError={this.isValidationError('contactLastName')} />
                            <input type="text" defaultValue={this.props.formValues.contactLastName} ref="contactLastName" id="contactLastName" className="contactLastName" />
                          </div>
                        </fieldset>

                        <FormFieldLabel fieldName="contactNumber" isOptional={false} hasError={this.isValidationError('contactNumber')} />
                        <input type="tel" defaultValue={this.props.formValues.contactNumber} ref="contactNumber" id="contactNumber" className="contactNumber"/>

                        <FormFieldLabel fieldName="contactEmail" isOptional={false} hasError={this.isValidationError('contactEmail')} />
                        <input type="email" defaultValue={this.props.formValues.contactEmail} ref="contactEmail" id="contactEmail" className="contactEmail"/>

                        <fieldset className="field-pair">
                          <legend>Participant name</legend>
                          <div className="sub-field">
                            <FormFieldLabel fieldName="participantName" isOptional={false} hasError={this.isValidationError('participantName')} />
                            <input type="text" defaultValue={this.props.formValues.participantName} ref="participantName" id="participantName" className="participantName"/>
                          </div>
                          <div className="sub-field">
                            <FormFieldLabel fieldName="participantLastName" isOptional={false} hasError={this.isValidationError('participantLastName')} />
                            <input type="text" defaultValue={this.props.formValues.participantLastName} ref="participantLastName" id="participantLastName" className="participantLastName"/>
                          </div>
                        </fieldset>

                        <FormFieldLabel fieldName="participantBirthYear" isOptional={false} hasError={this.isValidationError('participantBirthYear')} />
                        <aside>{ Strings.ageReminder }</aside>
                        <input type="number" defaultValue={this.props.formValues.participantBirthYear} ref="participantBirthYear" placeholder="YYYY" min="1980" max="2016" id="participantBirthYear" className="participantBirthYear"/>

                        <fieldset>
                          <legend>What type of school does the participant attend?</legend>
                          <InlineError errorFor={ this.isValidationError('schoolType') ? 'schoolType' : '' }/>
                          <div><input type="radio" name="schoolType" ref="schoolTypePrimary" id="schoolTypePrimary" value="Primary" /><label htmlFor="schoolTypePrimary">Primary</label></div>
                          <div><input type="radio" name="schoolType" ref="schoolTypeSecondary" id="schoolTypeSecondary" value="Secondary"/><label htmlFor="schoolTypeSecondary">Secondary</label></div>
                          <div><input type="radio" name="schoolType" ref="schoolTypeOther" id="schoolTypeOther" value="Other"/><label htmlFor="schoolTypeOther">Other</label>
                          <input type="text" defaultValue={this.props.formValues.schoolType} ref="schoolTypeOtherText" id="schoolTypeOtherText" className="other-field"/>
                          </div>
                        </fieldset>

                        <FormFieldLabel fieldName="additionalInfo" isOptional={true} hasError={this.isValidationError('additionalInfo')} />
                        <aside>{ Strings.additionalInfoAside }</aside>
                        <textarea defaultValue={this.props.formValues.additionalInfo} ref="additionalInfo" id="additionalInfo" className="additionalInfo"/>
                      </div>

                    <div className="navigation">
                        <button onClick={this.submitDetails}>Register</button>
                        <p>or <a onClick={this.props.previousStep} href={Resources.theLabHome}>return to The Lab</a></p>
                    </div>
                </div>
            </fieldset>
        )
    }
}
