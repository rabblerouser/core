import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import populateCountries from '../../public/javascript/countries.js';
import Details from '../Details.jsx';

describe('Details step', () => {
    let detailsForm;
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
                        }
                    };
    beforeEach(() => {
        spyOn(populateCountries, 'populateCountries');
        spyOn(populateCountries, 'setCountryAddress');

        detailsForm = TestUtils.renderIntoDocument(<Details
                                membershipType="full"
                                formValues={defaultFormValues}/>);
    });

    it('should show an error message if the details entered were invalid', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.findRenderedDOMComponentWithClass(detailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors).textContent).toMatch(/email/);
    });
});
