import React from 'react';
import { SignupPage } from '../SignupPage';
import PageError from '../PageError';
import { shallow } from 'enzyme';

describe('SignupPage', () => {
  it('renders the page error when on is provided', () => {
    const rendered = shallow(<SignupPage pageError="some error" />);
    expect(rendered.find(PageError).length).toEqual(1);
  });
  it('does not render a page error when one is not provided', () => {
    const rendered = shallow(<SignupPage />);
    expect(rendered.find(PageError).length).toEqual(0);
  });
});
