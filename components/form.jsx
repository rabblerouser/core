import React, {Component} from 'react';
import Eligibility from './eligibility.jsx';
import Details from './details.jsx';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.state = {  step: 1 };
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
                            postalAddress : {
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

    saveAndContinue() {
        this.nextStep();
    }

    render() {
        switch(this.state.step) {
            case 1:
            return <Eligibility nextStep={this.nextStep} />;
            case 2:
            return <Details nextStep={this.nextStep}
                            previousStep={this.previousStep}
                            formValues={this.formValues}/>;
        }
    }
}
