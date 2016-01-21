import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import NewMemberForm from '../NewMemberForm.jsx';
import MembershipType from '../MembershipType.jsx';
import ConfirmDetails from '../ConfirmDetails.jsx';
import Details from '../Details.jsx';
import populateCountries from '../../public/javascript/countries.js';
import $ from 'jquery';

describe('NewMemberForm', () => {
    beforeEach(() => {
        spyOn(populateCountries, 'populateCountries');
        spyOn(populateCountries, 'setCountryAddress');
        spyOn($, 'ajax').and.callFake((req) => {
            req.success();
        });
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
            var isCitizen = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'residentialStatus');
            var isMemberOfOtherParty = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isMemberOfOtherParty');
            var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'info-heading');

            expect(infoHeading).toEqual([]);

            isEnrolled[0].checked = true;
            TestUtils.Simulate.change(isEnrolled[0]);
            infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'info-heading');
            expect(infoHeading).toEqual([]);

            isCitizen[0].checked = true;
            TestUtils.Simulate.change(isCitizen[0]);
            infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'info-heading');
            expect(infoHeading).toEqual([]);

            isMemberOfOtherParty[0].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[0]);
            infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'info-heading');
            expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are eligible for a Full Membership./);
        });

        it('should show error if not all questions are answered', () => {
            let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            var isEnrolled = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isEnrolled');
            isEnrolled[0].checked = true;
            TestUtils.Simulate.click(continueButton);
            var errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch('Please answer all questions.');
        });

        it('should transition to details on button click when all questions answered', () => {
            let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            var isEnrolled = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isEnrolled');
            isEnrolled[0].checked = true;
            var isCitizen = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'residentialStatus');
            isCitizen[0].checked = true;
            var isMemberOfOtherParty = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isMemberOfOtherParty');
            isMemberOfOtherParty[0].checked = true;
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
        });
    });
});
