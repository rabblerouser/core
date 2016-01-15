import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import populateCountries from '../../public/javascript/countries.js';
import NewMemberForm from '../NewMemberForm.jsx';
import MembershipType from '../MembershipType.jsx';
import Details from '../Details.jsx';

describe('NewMemberForm', () => {
    beforeEach(() => {
        spyOn(populateCountries, 'populateCountries');
    });

    let newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

    it('should exist', () => {
        expect(TestUtils.isCompositeComponent(newMemberForm)).toBeTruthy();
    });

    it('initially shows the membership type step', () => {
        var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, "h1");
        expect(ReactDOM.findDOMNode(heading).textContent).toBe("Membership Type");
    });

    describe('On the membership type step', () => {
        it('should show the information about the type of membership that the user is eligible for', () => {
            var isEnrolled = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isEnrolled');
            isEnrolled[0].checked = true;
            TestUtils.Simulate.change(isEnrolled[0]);
            var infoHeading = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, 'info-heading');
            expect(ReactDOM.findDOMNode(infoHeading).textContent).toMatch(/You are eligible for a Full Membership./);
        });

        it('should transition to details on button click', () => {
            let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            TestUtils.Simulate.click(continueButton);
            var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, "h1");
            expect(ReactDOM.findDOMNode(heading).textContent).toBe("Details");
        });

        describe('On the details step', () => {
            it('should show an error message if the details entered were invalid', () => {
                let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
                TestUtils.Simulate.click(continueButton);
                var errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
                expect(ReactDOM.findDOMNode(errors).textContent).toMatch(/email/);
            });

            xit('should transition to payment on button click if the details entered were valid', () => {
                var inputDetails = {
                    firstName: 'x',
                    lastName: 'x',
                    dateOfBirth: '01/01/1950',
                    gender: 'potato',
                    email: 'xyz@abc.com',
                    primaryPhoneNumber: '0416555555',
                    residentialAddress: '100 Road Street',
                    residentialSuburb: 'Surry Hills',
                    residentialPostcode: '2000'
                };

                _.keys(inputDetails).forEach((key) => {
                    var field = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, key);
                    field.value = inputDetails[key];
                });

                var selectDetails = {
                    residentialState: 'NSW',
                    residentialCountry: 'Australia'
                };

                _.keys(selectDetails).forEach((key) => {
                    var field = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, key);
                    TestUtils.Simulate.change(field, { target: { value: selectDetails[key] } });
                });

                let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
                TestUtils.Simulate.click(continueButton);
                var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, "h1");
                expect(ReactDOM.findDOMNode(heading).textContent).toBe("Pay What You Want");
            });
        });
    });
});
