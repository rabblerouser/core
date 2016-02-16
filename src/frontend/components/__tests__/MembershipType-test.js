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

    describe('full membership', () => {
      it('should be shown given: yes, citizen, no', () => {
          isEnrolled[0].checked = true;
          isCitizen[0].checked = true;
          isMemberOfOtherParty[1].checked = true;
          TestUtils.Simulate.change(isMemberOfOtherParty[1]);
          var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
          expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to a Full Membership./);
      });
    });

    describe('permanent resident membership', () => {
      it('should be shown given: no, permanentResident, no', () => {
          isEnrolled[1].checked = true;
          isCitizen[1].checked = true;
          isMemberOfOtherParty[1].checked = true;
          TestUtils.Simulate.change(isMemberOfOtherParty[1]);
          var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
          expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to a Permanent Resident Membership./);
      });
    });

    describe('supporter membership', () => {
      it('should be shown given: no, permanentResident, yes', () => {
          isEnrolled[1].checked = true;
          isCitizen[1].checked = true;
          isMemberOfOtherParty[0].checked = true;
          TestUtils.Simulate.change(isMemberOfOtherParty[0]);
          var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
          expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to a Supporter Membership./);
      });

      it('should be shown given: yes, citizen, yes', () => {
          isEnrolled[0].checked = true;
          isCitizen[0].checked = true;
          isMemberOfOtherParty[0].checked = true;
          TestUtils.Simulate.change(isMemberOfOtherParty[0]);
          var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
          expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to a Supporter Membership./);
      });
    });
// Only Australian citizens can be enrolled to vote in Australian
// Australian citizens must be enrolled to become a member
    describe('international supporter membership', () => {
      it('should be shown given: no, international, yes', () => {
          isEnrolled[1].checked = true;
          isCitizen[2].checked = true;
          isMemberOfOtherParty[0].checked = true;
          TestUtils.Simulate.change(isMemberOfOtherParty[0]);
          var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
          expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to an International Membership./);
      });

      it('should be shown given: no, international, no', () => {
          isEnrolled[1].checked = true;
          isCitizen[2].checked = true;
          isMemberOfOtherParty[1].checked = true;
          TestUtils.Simulate.change(isMemberOfOtherParty[1]);
          var infoHeading = TestUtils.scryRenderedDOMComponentsWithClass(membershipTypeForm, 'info-heading');
          expect(ReactDOM.findDOMNode(infoHeading[0]).textContent).toMatch(/You are entitled to an International Membership./);
      });
    });

    describe('invalid membership type', () => {
      let citizensOnlyErrorMessage = "Only Australian citizens can be enrolled to vote in Australia"
      describe(citizensOnlyErrorMessage, () => {
        it('error should be shown given: yes, permanentResident, yes', () => {
            isEnrolled[0].checked = true;
            isCitizen[1].checked = true;
            isMemberOfOtherParty[0].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[0]);
            var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(citizensOnlyErrorMessage);
          });

        it('error should be shown given: no, permanentResident, no', () => {
            isEnrolled[0].checked = true;
            isCitizen[1].checked = true;
            isMemberOfOtherParty[1].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[1]);
            var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(citizensOnlyErrorMessage);
          });

        it('error should be shown given: yes, international, yes', () => {
            isEnrolled[0].checked = true;
            isCitizen[2].checked = true;
            isMemberOfOtherParty[0].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[0]);
            var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(citizensOnlyErrorMessage);
          });

        it('error should be shown given: yes, international, no', () => {
            isEnrolled[0].checked = true;
            isCitizen[2].checked = true;
            isMemberOfOtherParty[1].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[1]);
            var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(citizensOnlyErrorMessage);
          });
      });
      let mustBeEnrolledErrorMessage = 'Australian citizens must be enrolled to become a member'
      describe(mustBeEnrolledErrorMessage, () => {
        it('error should be shown given: no, citizen, no', () => {
            isEnrolled[1].checked = true;
            isCitizen[0].checked = true;
            isMemberOfOtherParty[1].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[1]);
            var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(mustBeEnrolledErrorMessage);
          });

        it('error should be shown given: no, citizen, yes', () => {
            isEnrolled[1].checked = true;
            isCitizen[0].checked = true;
            isMemberOfOtherParty[0].checked = true;
            TestUtils.Simulate.change(isMemberOfOtherParty[0]);
            var errors = TestUtils.findRenderedDOMComponentWithClass(membershipTypeForm, "errors");
            expect(ReactDOM.findDOMNode(errors).textContent).toMatch(mustBeEnrolledErrorMessage);
        });
      });
    });

    it('should transition to details on button click when all questions answered', () => {
        let continueButton = TestUtils.findRenderedDOMComponentWithTag(membershipTypeForm, 'button');

        isEnrolled[0].checked = true;
        isCitizen[0].checked = true;
        isMemberOfOtherParty[0].checked = true;
        TestUtils.Simulate.change(isEnrolled[0]);

        TestUtils.Simulate.click(continueButton);
        expect(setMembershipType).toHaveBeenCalledWith("supporter");
    });
});
