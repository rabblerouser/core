import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MembershipType from '../MembershipType.jsx';

describe('Membership type step', () => {
    let enrollmentNotAnsweredError = 'Are you enrolled to vote in Australia?';
    let citizenshipNotAnsweredError = 'Which of these applies to you?';
    let politicalPartyNotAnsweredError = 'Are you a member of another Australian political party?';
    let setMembershipType = jasmine.createSpy('setMembershipType');

    let isEnrolled, isCitizen, isMemberOfOtherParty, membershipTypeForm;

    beforeEach(() => {
         membershipTypeForm = TestUtils.renderIntoDocument(<MembershipType nextStep={setMembershipType}/>);
         isEnrolled = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'isEnrolled');
         isCitizen = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'residentialStatus');
         isMemberOfOtherParty = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'isMemberOfOtherParty');
    })

    it('should show error if not all questions are answered', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(membershipTypeForm, 'button');
        isEnrolled[0].checked = true;
        TestUtils.Simulate.click(continueButton);
        var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
        expect(ReactDOM.findDOMNode(errors).textContent).toMatch(citizenshipNotAnsweredError);
    });

    it('Validation error should go away when all fields filled', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(membershipTypeForm, 'button');
        var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
        isEnrolled[0].checked = true;
        isCitizen[0].checked = true;
        TestUtils.Simulate.click(continueButton);
        expect(ReactDOM.findDOMNode(errors).textContent).toMatch(politicalPartyNotAnsweredError);

        isMemberOfOtherParty[0].checked = true;
        errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
        expect(ReactDOM.findDOMNode(errors).textContent).toMatch('');
    });

    it('should show the information about the type of membership that the user is eligible for', () => {
        isCitizen[0].checked = true;
        isMemberOfOtherParty[0].checked = true;
        isEnrolled[0].checked = true;
        TestUtils.Simulate.change(isEnrolled[0]);
        var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
        expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to a Full Membership./);
    });

    it('should transition to details on button click when all questions answered', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(membershipTypeForm, 'button');

        isEnrolled[0].checked = true;
        isCitizen[0].checked = true;
        isMemberOfOtherParty[0].checked = true;
        TestUtils.Simulate.change(isEnrolled[0]);

        TestUtils.Simulate.click(continueButton);
        expect(setMembershipType).toHaveBeenCalledWith("full");
    });
});
