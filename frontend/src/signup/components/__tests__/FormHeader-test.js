import React from 'react';
import FormHeader from '../FormHeader';
import { shallow } from 'enzyme';

describe('FormHeader', () => {
  it('renders the org name details', () => {
    const rendered = shallow(<FormHeader orgName="my organisation" />);
    const header = rendered.find('h1');
    expect(header.text()).toContain('Register for my organisation');
  });
});
