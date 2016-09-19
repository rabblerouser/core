import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import NewMemberForm from '../NewMemberForm';

import windowLocationUtil from '../../../lib/windowLocationUtil.js';

describe('NewMemberForm', () => {
  it('should exist', () => {
    spyOn(windowLocationUtil, 'getQueryParameters').and.returnValue('d');
    const newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

    expect(TestUtils.isCompositeComponent(newMemberForm)).toBeTruthy();
  });

  it('initially shows the enter details step', () => {
    spyOn(windowLocationUtil, 'getQueryParameters').and.returnValue('s');
    const newMemberForm = TestUtils.renderIntoDocument(<NewMemberForm />);

    const heading = TestUtils.findRenderedDOMComponentWithTag(newMemberForm, 'h1');
    expect(ReactDOM.findDOMNode(heading).textContent).toBe('Register for Rabble Rouser');
  });
});
