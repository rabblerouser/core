jest.dontMock('../../../components/NewMemberForm.jsx');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {NewMemberForm} from '../../../components/NewMemberForm.jsx';

describe('NewMemberForm', () => {
    it('should exist', () => {
        var form = TestUtils.renderIntoDocument(<NewMemberForm />);
        expect(TestUtils.isCompositeComponent(form)).toBeTruthy();
    });
});
