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
      let enrollmentNotAnsweredError = 'Are you enrolled to vote in Australia?';
      let citizenshipNotAnsweredError = 'Which of these applies to you?';
      let politicalPartyNotAnsweredError = 'Are you a member of another Australian political party?';

      let isEnrolled, isCitizen, isMemberOfOtherParty;

      beforeEach(() => {
           isEnrolled = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isEnrolled');
           isCitizen = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'residentialStatus');
           isMemberOfOtherParty = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'isMemberOfOtherParty');
      })

        it('should show error if not all questions are answered', () => {
            let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            isEnrolled[0].checked = true;
            TestUtils.Simulate.click(continueButton);
            var errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(citizenshipNotAnsweredError);
        });

        it('Validation error should go away when all fields filled', () => {
            let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            var errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
            isEnrolled[0].checked = true;
            isCitizen[0].checked = true;
            TestUtils.Simulate.click(continueButton);
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(politicalPartyNotAnsweredError);

            isMemberOfOtherParty[0].checked = true;
            errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch('');
        });

        it('should show the information about the type of membership that the user is eligible for', () => {    
            TestUtils.Simulate.change(isEnrolled[0]);
            var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(newMemberForm, 'info-heading');
            expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to a Full Membership./);
        });

        it('should transition to details on button click when all questions answered', () => {
            let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');

            isEnrolled[0].checked = true;
            isCitizen[0].checked = true;
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
