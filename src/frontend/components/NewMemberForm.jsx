import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Details from './Details.jsx';
import ProgressBar from './ProgressBar.jsx';
import Finished from './Finished.jsx';
import { ApplicationForm, Resources } from '../config/strings';
import $ from 'jquery';

export default class NewMemberForm extends Component {
  constructor(props) {
    super(props);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.postAndContinue = this.postAndContinue.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.getForm = this.getForm.bind(this);

    const startingState = 1;
    this.state = {
      errors: [],
      step: (this.props.initialState === undefined ? startingState : this.props.initialState),
      membershipType: 'full',
    };
    this.formValues = {
      labSelection: '',
      contactName: '',
      contactLastName: '',
      contactNumber: '',
      contactEmail: '',
      participantName: '',
      participantLastName: '',
      participantBirthYear: '',
      schoolType: '',
      additionalInfo: '',
    };
  }

  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollIntoView();
  }

  nextStep() {
    this.setState({ step: this.state.step + 1 });
  }

  previousStep() {
    this.setState({ step: this.state.step - 1 });
  }

  saveAndContinue(fieldValues) {
    this.formValues = fieldValues;
    this.nextStep();
  }

  postAndContinue(fieldValues) {
    $.ajax({
      type: 'POST',
      url: `/${Resources.applicationsEndPoint}`,
      data: fieldValues,
      success: value => {
        this.invoiceId = value.invoiceId;
        this.nextStep();
      },
      error: () => {
        this.setState({ errors: ApplicationForm.remoteSubmitErrorTitle });
      },
    });
  }

  getForm() {
    switch (this.state.step) {
      case 1:
        return (
          <Details formValues={this.formValues} postAndContinue={this.postAndContinue} errors={this.state.errors} />
        );
      case 2:
        return (<Finished email={this.formValues.email} nextStep={this.nextStep} />);
      default:
        return <div />;
    }
  }

  render() {
    return (
      <div>
        <ProgressBar progress={this.state.step} />
        {this.getForm()}
      </div>
    );
  }
}
