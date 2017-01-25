import React from 'react';
import { shallow } from 'enzyme';
import { GroupSelect } from '../GroupSelect';

describe('GroupList', () => {
  const sampleGroups = [{ id: '1', name: 'A group' }, { id: '2', name: 'Another group' }];
  let rendered;
  beforeEach(() => {
    rendered = shallow(<GroupSelect groups={sampleGroups} onSelect={() => {}} />);
  });

  it('renders unassigned as a default option', () => {
    expect(rendered.containsMatchingElement(
      <option value="unassigned">Unassigned</option>,
    )).toEqual(true);
  });

  it('renders all participants as a default option', () => {
    expect(rendered.containsMatchingElement(
      <option value="all">All members</option>,
    )).toEqual(true);
  });

  it('renders the groups as options', () => {
    expect(rendered.containsMatchingElement(
      <option value="1">A group</option>,
    )).toEqual(true);
    expect(rendered.containsMatchingElement(
      <option value="2">Another group</option>),
    ).toEqual(true);
  });
});
