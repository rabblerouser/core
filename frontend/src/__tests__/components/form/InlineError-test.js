import React from 'react';
import InlineError from '../../../components/form/InlineError.jsx';
import { shallow } from 'enzyme';

describe('InlineError', () => {
  it('have text for the error field', () => {
    const rendered = shallow(<InlineError errorFor="contactName" />);
    expect(rendered.text()).toContain('Please enter a contact name. No symbols allowed.');
  });
});
