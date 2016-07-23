import React, { Component } from 'react';
import Errors from './Errors.jsx';
import NewMemberFields from './form/NewMemberFields.jsx';
import applicationValidator from '../services/applicationValidator';
import { ApplicationForm as Strings, FormValidationErrors as ErrorStrings, Resources } from '../config/strings.js';
import branchService from '../services/branchService';
import memberAdapter from '../adapters/memberAdapter';

export default class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invalidFields: [],
      errorNames: [],
      branches: [],
      fieldValues: props.formValues,
    };
    this.onChange = this.onChange.bind(this);
    this.submitDetails = this.submitDetails.bind(this);
  }

  componentDidMount() {
    branchService.getBranches()
      .then(branches => {
        this.setState({ branches });
      })
      .catch(() => {
        this.setState({
          errors: 'No branches',
          errorTitle: Strings.branchListErrorTitle,
        });
      });
  }

  componentWillReceiveProps(props) {
    this.setState({
      errors: props.errors,
      errorTitle: props.errors,
    });
  }

  onChange(fieldName) {
    return event => (
      this.setState({ fieldValues: { ...this.state.fieldValues, [fieldName]: event.target.value } })
    );
  }

  handleValidationErrors(validationErrors, scrollToError) {
    const invalidFields = validationErrors;
    const errors = invalidFields.map(error => ErrorStrings[error].name);

    this.setState({
      invalidFields,
      errorNames: errors,
      scrollToError,
      errorTitle: Strings.validationErrorTitle,
    });
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
        <h1 className="form-title">Register</h1>
        <div className="form-body">
          <Errors
            invalidFields={this.state.errorNames}
            scrollToError={this.state.scrollToError}
            errorTitle={this.state.errorTitle}
          />

          <NewMemberFields
            onChange={this.onChange}
            invalidFields={this.state.invalidFields}
            branches={this.state.branches}
            formValues={this.props.formValues}
          />

          <div className="navigation">
            <button onClick={this.submitDetails}>Register</button>
            {Resources.homePage && <p>or <a href={Resources.homePage}>return home</a></p>}
          </div>
        </div>
      </section>
    );
  }
}

Details.propTypes = {
  formValues: React.PropTypes.object.isRequired,
  errors: React.PropTypes.array.isRequired,
  postAndContinue: React.PropTypes.func.isRequired,
};
