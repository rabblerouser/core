import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import populateCountries from '../../public/javascript/countries.js';
import NewMemberForm from '../NewMemberForm.jsx';
import MembershipType from '../MembershipType.jsx';

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
            beforeEach(() => {
                let continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
                TestUtils.Simulate.click(continueButton);
            });

            it('should show an error message if the details entered were invalid', () => {
                var errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
                expect(ReactDOM.findDOMNode(errors).textContent).toMatch(/email/);
            });
        });
    });
});
