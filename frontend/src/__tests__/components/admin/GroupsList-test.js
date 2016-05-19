import React from 'react';
import GroupsList from '../../../components/admin/groupView/GroupsList.jsx';
import sd from 'skin-deep';

describe('GroupList', () => {
  let renderedTree = '';
  describe('render', () => {
    let sampleGroups = [{ name: 'A group' }, { name: 'Another group' }];

    beforeEach(() => {
      renderedTree = sd.shallowRender(<GroupsList groups={sampleGroups} onSave={''} />);
    });

    xit('has a single select element with options for each group provided plus the All Participants option', () => {
      const element = renderedTree.subTree('select');
      expect(element).not.toBeFalsy();
      expect(element.props.children.length).toBe(3);
    });
  });
});
