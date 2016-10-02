import React from 'react';
import PageError from '../PageError';
import { shallow } from 'enzyme';

describe('PageError', () => {
  it('renders the page error', () => {
    const rendered = shallow(<PageError pageError="some error" />);
    expect(rendered.contains('some error')).toEqual(true);
  });
});
