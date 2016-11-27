import React from 'react';
import { GroupDetails } from '../GroupDetails';
import { shallow } from 'enzyme';

describe('<GroupDetails />', () => {
  it('renders the group description', () => {
    const rendered = shallow(<GroupDetails group={{ description: 'a description' }} />);
    expect(rendered.text()).toContain('a description');
  });

  it('renders nothing when no group is provided', () => {
    const rendered = shallow(<GroupDetails />);
    expect(rendered.html()).toBe(null);
  });
});
