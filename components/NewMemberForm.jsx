import React, {Component} from 'react';
import Eligibility from './Eligibility.jsx';
import Details from './Details.jsx';
import Payment from './payment.jsx';

export class NewMemberForm extends Component {
    constructor(props) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        this.state = { step: 1 };
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

    saveAndContinue(fieldValues) {
        this.nextStep();
        this.render();
    }

    render() {
        switch(this.state.step) {
            case 1:
                return <Eligibility nextStep={this.nextStep} />;
            case 2:
                return <Details formValues={this.formValues}
                                saveAndContinue={this.saveAndContinue} />;
            case 3:
                return <Payment email={"hello@wow.com"}/>;
        }
    }
}
