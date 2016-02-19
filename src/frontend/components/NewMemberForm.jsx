import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Details from './Details.jsx';
import ConfirmDetails from './ConfirmDetails.jsx';
import ProgressBar from './ProgressBar.jsx';
import Finished from './Finished.jsx';
import $ from 'jquery';
let windowLocationUtil = require('../lib/windowLocationUtil.js');

export default class NewMemberForm extends Component {
    constructor(props) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.postAndContinue = this.postAndContinue.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.getForm = this.getForm.bind(this);

        let startingState = 1;
        this.state = { errors: [],
                       step: (this.props.initialState === undefined ? startingState : this.props.initialState),
                       membershipType: 'full' };
        this.formValues = {
                            membershipType: '',
                            isEnrolled: '',
                            residentialStatus: '',
                            isMemberOfOtherParty: '',
                            eligibility: '',
                            firstName: '',
                            lastName: '',
                            dateOfBirth: '',
                            gender: '',
                            email: '',
                            primaryPhoneNumber: '',
                            secondaryPhoneNumber: '',
                            residentialAddress: {
                                address: '',
                                suburb: '',
                                country: '',
                                state: '',
                                postcode: ''
                            },
                            postalAddress: {
                                address: '',
                                suburb: '',
                                country: '',
                                state: '',
                                postcode: ''
                            }
                        };
    }

    componentDidUpdate() {
        ReactDOM.findDOMNode(this).scrollIntoView();
    }

    nextStep() {
        this.setState( { step: this.state.step + 1  } );
    }

    previousStep() {
        this.setState( { step: this.state.step - 1  } );
    }

    saveAndContinue(fieldValues) {
      this.formValues = fieldValues;
      this.nextStep();
    }

    postAndContinue(fieldValues) {
      $.ajax({
          type: 'POST',
          url: '/members',
          data: fieldValues,
          success: function(value) {
              this.invoiceId = value.invoiceId;
              this.nextStep();
          }.bind(this),
          error: function () {
              this.setState({errors: ['Sorry, we could not register you this time. Please try again, or ' +
              'contact us at admin@thelab.org.au']});
          }.bind(this)
      });
    }

    checkIfPaypalFinishStep() {
      return windowLocationUtil.getQueryParameters().indexOf('?tx=') !== -1;
    }

    getForm() {
      switch(this.state.step) {
          case 1:
              return <Details formValues={this.formValues}
                              saveAndContinue={this.saveAndContinue}
                              membershipType={this.state.membershipType} />;
          case 2:
              return <ConfirmDetails formValues={this.formValues}
                                    postAndContinue={this.postAndContinue}
                                    previousStep={this.previousStep}
                                    errors={this.state.errors}/>;
          case 3:
              return <Finished email={this.formValues.email}
                                nextStep={this.nextStep} />;
      };
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
