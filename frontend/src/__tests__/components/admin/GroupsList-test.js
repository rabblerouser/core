import React from 'react';
import GroupsList from '../../../components/admin/groupView/GroupsList.jsx';
import { shallow } from 'enzyme';

describe('GroupList', () => {
  const sampleGroups = [{ name: 'A group' }, { name: 'Another group' }];

  it('renders unassigned as a default option', () => {
    const rendered = shallow(<GroupsList groups={sampleGroups} />);
    expect(rendered.text()).toContain('Unassigned');
  });

  it('renders all aprticipants as a default option', () => {
    const rendered = shallow(<GroupsList groups={sampleGroups} />);
    expect(rendered.text()).toContain('All members');
  });

  it('renders the groups as options', () => {
    const rendered = shallow(<GroupsList groups={sampleGroups} />);
    expect(rendered.text()).toContain('A group');
    expect(rendered.text()).toContain('Another group');
  });
});
