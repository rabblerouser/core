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
                                membershipType='full'
                                formValues={defaultFormValues}/>);
    });

    it('should show list of invalid fields if the details entered were invalid', () => {
        let expectedErrors = 'First NameLast NameEmailPhone NumberDate of BirthResidential AddressResidential SuburbResidential PostcodeResidential Country';
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors[0]).textContent).toMatch(expectedErrors);
    });

    it('should show first name error message if it wasn\'t filled in', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors[1]).textContent).toMatch(/first name/);
    });

    it('should show last name error message if it wasn\'t filled in', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors[2]).textContent).toMatch(/last name/);
    });

    it('should show date of birth error message if it wasn\'t filled in', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors[3]).textContent).toMatch(/Must be in the format/);
    });

    it('should show email error message if it wasn\'t filled in', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(detailsForm, 'button');
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.scryRenderedDOMComponentsWithClass(detailsForm, "errors");
        expect(ReactDOM.findDOMNode(errors[4]).textContent).toMatch(/Please enter your address./);
    });
});
