import React from 'react';
import FieldError from '../FieldError';
import { shallow } from 'enzyme';

describe('FieldError', () => {
  it('should render the provided error message', () => {
    const rendered = shallow(<FieldError error="some error" />);
    expect(rendered.text()).toContain('some error');
  });
});
