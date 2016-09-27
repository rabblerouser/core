import React from 'react';
import RegisterButton from '../RegisterButton';
import { shallow } from 'enzyme';

describe('RegisterButton', () => {
  it('renders the provided children', () => {
    const rendered = shallow(<RegisterButton>Now</RegisterButton>);
    const button = rendered.find('button');
    expect(button.text()).toContain('Now');
  });
});
