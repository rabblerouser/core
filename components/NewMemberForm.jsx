import React, {Component} from 'react';
import Eligibility from './Eligibility.jsx';
import Details from './Details.jsx';
import Payment from './Payment.jsx';
import $ from 'jquery';

export default class NewMemberForm extends Component {
    constructor(props) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.saveSuccess = this.saveSuccess.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        this.render = this.render.bind(this);
        this.state = { step: 1, email: '' };
        this.formValues = {
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

    nextStep() {
        this.setState( { step: this.state.step + 1  } )
    }

    previousStep() {
        this.setState( { step: this.state.step - 1  } )
    }

    saveSuccess(data) {
        this.nextStep();
    }

    saveAndContinue(fieldValues) {
        this.setState({email: fieldValues.email});
        $.ajax({
            type: 'POST',
            url: '/members',
            data: fieldValues,
            success: this.saveSuccess
        });
    }

    render() {
        switch(this.state.step) {
            case 1:
                return <Eligibility nextStep={this.nextStep} />;
            case 2:
                return <Details formValues={this.formValues}
                                saveAndContinue={this.saveAndContinue} />;
            case 3:
                return <Payment email={this.state.email}/>;
        }
    }
}
