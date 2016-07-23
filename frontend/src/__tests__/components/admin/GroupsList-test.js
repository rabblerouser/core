import React from 'react';
import GroupsList from '../../../components/admin/groupView/GroupsList.jsx';
import { shallow } from 'enzyme';

describe('GroupList', () => {
  const sampleGroups = [{ id: '1', name: 'A group' }, { id: '2', name: 'Another group' }];

  it('renders unassigned as a default option', () => {
    const rendered = shallow(<GroupsList groups={sampleGroups} onSelect={() => {}} />);
    expect(rendered.text()).toContain('Unassigned');
  });

  it('renders all participants as a default option', () => {
    const rendered = shallow(<GroupsList groups={sampleGroups} onSelect={() => {}} />);
    expect(rendered.text()).toContain('All members');
  });

  it('renders the groups as options', () => {
    const rendered = shallow(<GroupsList groups={sampleGroups} onSelect={() => {}} />);
    expect(rendered.text()).toContain('A group');
    expect(rendered.text()).toContain('Another group');
  });
});
