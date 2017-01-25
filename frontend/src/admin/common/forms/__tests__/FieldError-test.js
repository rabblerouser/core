import React from 'react';
import { mount } from 'enzyme';
import FieldError from '../FieldError';

describe('FieldError', () => {
  it('should render the provided error message', () => {
    const rendered = mount(<FieldError error="some error" />);
    expect(rendered.text()).toContain('some error');
  });
});
