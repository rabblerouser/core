import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import NewMemberForm from '../NewMemberForm.jsx';
import populateCountries from '../../../../public/javascript/countries.js';
let windowLocationUtil = require('../../lib/windowLocationUtil.js');
import $ from 'jquery';

describe('NewMemberForm', () => {
    it('should exist', () => {
        spyOn(windowLocationUtil, 'getQueryParameters').and.returnValue('d');
        spyOn(populateCountries, 'populateCountries');
        spyOn(populateCountries, 'setCountryAddress');

        let newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

        expect(TestUtils.isCompositeComponent(newMemberForm)).toBeTruthy();
    });

    it('initially shows the enter details step', () => {
        spyOn(windowLocationUtil, 'getQueryParameters').and.returnValue('s');
        spyOn(populateCountries, 'populateCountries');
        spyOn(populateCountries, 'setCountryAddress');

        let newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

        var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'h1');
        expect(ReactDOM.findDOMNode(heading).textContent).toBe('Details');
    });
});
