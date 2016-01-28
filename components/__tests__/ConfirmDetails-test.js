import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ConfirmDetails from '../ConfirmDetails.jsx';

describe('Details step', () => {
    let confirmDetailsForm;
    let defaultFormValues = {
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
                        }, membershipType: "full"
                    };
    beforeEach(() => {
        confirmDetailsForm = TestUtils.renderIntoDocument(<ConfirmDetails formValues={defaultFormValues}/>);
    });

    it('should show an error message if the confirm button was not clicked', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(confirmDetailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.findRenderedDOMComponentWithClass(confirmDetailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors).textContent).toMatch(/Please click the declaration checkbox and check that your details are correct before continuing./);
    });

    it('should show full member confirmation text', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(confirmDetailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var declarationText = TestUtils.scryRenderedDOMComponentsWithClass(confirmDetailsForm, "declaration-text");
        expect(ReactDOM.findDOMNode(declarationText[0]).textContent).toMatch(/Australia Electoral Commission/);
    });

    it('should show non full member confirmation text', () => {
        defaultFormValues.membershipType = "supporter";
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(confirmDetailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var declarationText = TestUtils.scryRenderedDOMComponentsWithClass(confirmDetailsForm, "declaration-text");
        expect(ReactDOM.findDOMNode(declarationText[0]).textContent).not.toMatch(/Australia Electoral Commission/);
    });
});
