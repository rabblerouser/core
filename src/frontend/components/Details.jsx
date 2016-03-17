'use strict';

import React, {Component} from 'react';
import Errors from './Errors.jsx';
import * as memberValidator from '../services/memberValidator';
import countrySelector from '../../../public/javascript/countries.js';
import { FormValidationErrors as ErrorStrings } from '../config/strings.js';
import { ApplicationForm as Strings, Resources } from '../config/strings.js';
import FormFieldLabel from './form/FormFieldLabel.jsx';
import MemberFields from './admin/MemberFields.jsx';

import labService from '../services/labService';
import memberAdapter from '../adapters/memberAdapter';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.handleValidationErrors = this.handleValidationErrors.bind(this);
        this.render = this.render.bind(this);
        this.validator = memberValidator;
        this.state = {
            invalidFields: [],
            errorNames: [],
            labs: [],
            fieldValues: {}
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

    getSchoolType(fieldValues) {
        if (fieldValues.schoolType === 'Other') {
            return fieldValues.schoolTypeOtherText;
        }

        return fieldValues.schoolType;
    }

    onChange(fieldName) {
        let detailsComponent = this;

        return function(event) {
            let newFieldValues = Object.assign({}, detailsComponent.state.fieldValues, {[fieldName] : event.target.value});
            detailsComponent.setState({
                fieldValues: newFieldValues
            });

        }
    }

    submitDetails() {

        var fieldValues = {
            labSelection: this.state.fieldValues.labSelection,
            contactName: this.state.fieldValues.contactName,
            contactLastName: this.state.fieldValues.contactLastName,
            contactNumber: this.state.fieldValues.contactNumber,
            contactEmail: this.state.fieldValues.contactEmail,
            participantName: this.state.fieldValues.participantName,
            participantLastName: this.state.fieldValues.participantLastName,
            participantBirthYear: this.state.fieldValues.participantBirthYear,
            schoolType: this.getSchoolType(this.state.fieldValues),
            additionalInfo: this.state.fieldValues.additionalInfo
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
            <section>
                <h1 className="form-title">Details</h1>
                <div className="form-body">
                    <Errors invalidFields={this.state.errorNames}
                            scrollToError={this.state.scrollToError}
                            errorTitle={this.state.errorTitle}/>
                    <p>{Strings.instructions}</p>
                    <p><strong>{ Strings.byoReminder }</strong></p>

                    <MemberFields onChange={this.onChange.bind(this)} invalidFields={this.state.invalidFields} labs={this.state.labs} ref="memberDetails" formValues={this.props.formValues}/>

                    <div className="navigation">
                        <button onClick={this.submitDetails.bind(this)}>Register</button>
                        <p>or <a onClick={this.props.previousStep} href={Resources.theLabHome}>return to The Lab</a></p>
                    </div>
                </div>
            </section>
        )
    }
}
