import React, { Component } from 'react';
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
      fieldValues: {},
    };
  }

  componentDidMount() {
    labService.getLabList()
      .then(labs => {
        this.setState({ labs });
      })
      .catch(() => {
        this.setState({
          errors: 'No labs',
          errorTitle: Strings.remoteLabListErrorTitle,
        });
      });
  }

  componentWillReceiveProps(props) {
    this.setState({
      errors: props.errors,
      errorTitle: props.errors,
    });
  }

  handleValidationErrors(validationErrors, scrollToError) {
    const invalidFields = validationErrors;
    const errors = [];
    invalidFields.forEach(error => errors.push(ErrorStrings[error].name));

    this.setState({
      invalidFields,
      errorNames: errors,
      scrollToError,
      errorTitle: Strings.validationErrorTitle,
    });
  }

  onChange(fieldName) {
    const detailsComponent = this;

    return event => {
      const newFieldValues = Object.assign({}, detailsComponent.state.fieldValues, { [fieldName]: event.target.value });
      detailsComponent.setState({ fieldValues: newFieldValues });
    };
  }

  getSchoolType(fieldValues) {
    if (fieldValues.schoolType === 'Other') {
      return fieldValues.schoolTypeOtherText;
    }

    return fieldValues.schoolType;
  }

  submitDetails() {
    this.setState({ invalidFields: [], errorNames: [], errorTitle: '' });
    const validationErrors = applicationValidator.isValid(this.state.fieldValues);

    if (validationErrors.length > 0) {
      this.handleValidationErrors(validationErrors, true);
    } else {
      const payload = memberAdapter.prepareNewMemberPayload(this.state.fieldValues);
      this.props.postAndContinue(payload);
    }
  }

  render() {
    return (
      <section>
        <h1 className="form-title">Register for The Lab</h1>
        <div className="form-body">
          <Errors
            invalidFields={this.state.errorNames}
            scrollToError={this.state.scrollToError}
            errorTitle={this.state.errorTitle}
          />
          <p>{Strings.instructions}</p>
          <p><strong>{Strings.byoReminder}</strong></p>

          <NewMemberFields
            onChange={this.onChange.bind(this)}
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
    );
  }
}
