import React from 'react';
import { shallow } from 'enzyme';
import PageError from '../PageError';

describe('PageError', () => {
  it('renders the page error', () => {
    const rendered = shallow(<PageError pageError="some error" />);
    expect(rendered.contains('some error')).toEqual(true);
  });
});
