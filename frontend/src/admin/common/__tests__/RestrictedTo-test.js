import React from 'react';
import { shallow } from 'enzyme';
import { RestrictedTo } from '../RestrictedTo';

describe('RestrictedTo', () => {
  it('renders the child when the userType is the type', () => {
    const rendered = shallow(
      <RestrictedTo type="SUPER" userType="SUPER">
        <section />
      </RestrictedTo>,
    );
    expect(rendered.find('section').length).toBe(1);
  });

  it('doesn\'t render the child when the userType is not type', () => {
    const rendered = shallow(
      <RestrictedTo userType="SUPER">
        <section />
      </RestrictedTo>,
    );
    expect(rendered.text()).toBe('');
  });

  it('doesn\'t render anything when there is no child provided', () => {
    const rendered = shallow(
      <RestrictedTo type="SUPER" userType="SUPER" />,
    );
    expect(rendered.text()).toBe('');
  });

  it('doesn\'t render anything when are multiple children provided', () => {
    const rendered = shallow(
      <RestrictedTo type="SUPER" userType="SUPER">
        <section />
        <section />
      </RestrictedTo>,
    );
    expect(rendered.text()).toBe('');
  });
});
