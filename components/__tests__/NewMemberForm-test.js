import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import NewMemberForm from '../NewMemberForm.jsx';

describe('NewMemberForm', () => {
    it('should exist', () => {
        let form = TestUtils.renderIntoDocument(<NewMemberForm />);
        expect(TestUtils.isCompositeComponent(form)).toBeTruthy();
    });
});
