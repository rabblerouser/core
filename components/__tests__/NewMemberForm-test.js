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
        var eligibility = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, 'eligibility-form');
        expect(TestUtils.isDOMComponent(eligibility)).toBeTruthy();
    });

    describe('On the eligibility step', ()=> {
        it('should transition to details on button click', () => {
            var continueButton = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'button');
            TestUtils.Simulate.click(continueButton);
            var details = TestUtils.findRenderedDOMComponentWithClass(newMemberForm, 'details-form');
            expect(TestUtils.isDOMComponent(details)).toBeTruthy();
        });
    });
});
