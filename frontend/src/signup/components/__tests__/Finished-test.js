import React from 'react';
import { Finished } from '../Finished';
import { shallow } from 'enzyme';

describe('Finished', () => {
  it('renders the page with the home url', () => {
    const rendered = shallow(<Finished homeUrl="https://some-url.com" />);
    const anchor = rendered.find('a');
    expect(anchor.first().props().href).toEqual('https://some-url.com');
  });

  it('no link is rendered when there is no url provided', () => {
    const rendered = shallow(<Finished homeUrl="" />);
    const anchor = rendered.find('a');
    expect(anchor.length).toEqual(0);
  });
});
