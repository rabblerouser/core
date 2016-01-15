import React, {Component} from 'react';
import MembershipType from './MembershipType.jsx';
import Details from './Details.jsx';
import Payment from './payment.jsx';
import $ from 'jquery';

export default class NewMemberForm extends Component {
    constructor(props) {
        super(props);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.saveSuccess = this.saveSuccess.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        this.state = { step: (this.props.initialState === undefined ? 1 : this.props.initialState) };
        this.formValues = {
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
                return <MembershipType nextStep={this.nextStep}
                                       formValues={this.formValues} />;
            case 2:
                return <Details formValues={this.formValues}
                                saveAndContinue={this.saveAndContinue} />;
            case 3:
                return <Payment email={"hello@wow.com"}/>;
        }
    }
}
