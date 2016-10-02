import React from 'react';
import Logo from '../Logo';
import { shallow } from 'enzyme';

describe('Logo', () => {
  it('renders the org name details', () => {
    const rendered = shallow(<Logo skin="my-org" />);
    const image = rendered.find('img');
    expect(image.first().props().src).toEqual('/images/my-org/logo_signup_page.png');
  });
});
