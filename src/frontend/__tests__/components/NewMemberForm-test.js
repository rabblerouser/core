'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import NewMemberForm from '../../components/NewMemberForm.jsx';
import $ from 'jquery';

let windowLocationUtil = require('../../lib/windowLocationUtil.js');

describe('NewMemberForm', () => {
    it('should exist', () => {
        spyOn(windowLocationUtil, 'getQueryParameters').and.returnValue('d');
        let newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

        expect(TestUtils.isCompositeComponent(newMemberForm)).toBeTruthy();
    });

    it('initially shows the enter details step', () => {
        spyOn(windowLocationUtil, 'getQueryParameters').and.returnValue('s');
        let newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

        var heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'h1');
        expect(ReactDOM.findDOMNode(heading).textContent).toBe('Register for The Lab');
    });
});
