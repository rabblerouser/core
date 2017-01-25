import React from 'react';
import { shallow } from 'enzyme';
import { GroupDetails } from '../GroupDetails';

describe('<GroupDetails />', () => {
  it('renders the group description', () => {
    const rendered = shallow(<GroupDetails group={{ description: 'a description' }} />);
    expect(rendered.find('p').text()).toContain('a description');
  });

  it('renders nothing when no group is provided', () => {
    const rendered = shallow(<GroupDetails />);
    expect(rendered.html()).toBe(null);
  });
});
