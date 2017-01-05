import React from 'react';
import { shallow } from 'enzyme';
import FieldError from '../FieldError';

describe('FieldError', () => {
  it('should render the provided error message', () => {
    const rendered = shallow(<FieldError error="some error" />);
    expect(rendered.text()).toContain('some error');
  });
});
