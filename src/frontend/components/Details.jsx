'use strict';

import React, {Component} from 'react';
import Errors from './Errors.jsx';
import NewMemberFields from './form/NewMemberFields.jsx';
import applicationValidator from '../services/applicationValidator';
import { ApplicationForm as Strings, FormValidationErrors as ErrorStrings, Resources } from '../config/strings.js';
import labService from '../services/labService';
import memberAdapter from '../adapters/memberAdapter';

export default class Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalidFields: [],
            errorNames: [],
            labs: [],
            fieldValues: {}
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
            errors.push(ErrorStrings[error].name);
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
        };
    }

    submitDetails() {

        this.setState({invalidFields: [], errorNames: [], errorTitle:''});
        var validationErrors = applicationValidator.isValid(this.state.fieldValues);

        if (validationErrors.length > 0) {
            this.handleValidationErrors(validationErrors, true);
        } else {
            let payload = memberAdapter.prepareNewMemberPayload(this.state.fieldValues);
            this.props.postAndContinue(payload);
        }
    }

    render() {
        return (
            <section>
                <h1 className="form-title">Register for The Lab</h1>
                <div className="form-body">
                    <Errors invalidFields={this.state.errorNames}
                            scrollToError={this.state.scrollToError}
                            errorTitle={this.state.errorTitle}/>
                    <p>{Strings.instructions}</p>
                    <p><strong>{ Strings.byoReminder }</strong></p>

                    <NewMemberFields onChange={this.onChange.bind(this)}
                                  invalidFields={this.state.invalidFields}
                                  labs={this.state.labs}
                                  formValues={this.props.formValues}
                    />

                    <div className="navigation">
                        <button onClick={this.submitDetails.bind(this)}>Register</button>
                        <p>or <a onClick={this.props.previousStep} href={Resources.theLabHome}>return to The Lab</a></p>
                    </div>
                </div>
            </section>
        )
    }
}
