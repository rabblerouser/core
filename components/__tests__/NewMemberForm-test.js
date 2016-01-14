import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import populateCountries from '../../public/javascript/countries.js';
import NewMemberForm from '../NewMemberForm.jsx';

describe('NewMemberForm', () => {
    beforeEach(() => {
        spyOn(populateCountries, 'populateCountries');
    });

    let newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

    it('should exist', () => {
        expect(TestUtils.isCompositeComponent(newMemberForm)).toBeTruthy();
    });

    it('initially shows the eligibility step', () => {
        var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, "h1");
        expect(ReactDOM.findDOMNode(heading).textContent).toBe("Eligibility");
    });

    describe('On the eligibility step', () => {
        beforeEach(()=> {
            var continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            TestUtils.Simulate.click(continueButton);
        });

        it('should transition to details on button click', () => {
            var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, "h1");
            expect(ReactDOM.findDOMNode(heading).textContent).toBe("Details");
        });

        describe('On the details step', () => {
            it('should show an error message if the details were invalid', () => {
                var continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
                TestUtils.Simulate.click(continueButton);
                var errors = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, "errors");
                expect(ReactDOM.findDOMNode(errors).textContent).toMatch(/email/);
            });
        });
    });
});
