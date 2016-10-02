import React from 'react';
import InlineError from '../InlineError';
import { shallow } from 'enzyme';

describe('InlineError', () => {
  it('have text for the error field', () => {
    const rendered = shallow(<InlineError errorFor="memberName" />);
    expect(rendered.text()).toContain('Please enter the member\'s name. No symbols allowed.');
  });
});
