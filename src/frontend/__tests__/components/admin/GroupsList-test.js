'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import GroupsList from '../../../components/admin/GroupsList.jsx';
import sd from 'skin-deep';
import GroupListEntry from '../../../components/admin/GroupListEntry.jsx';


describe('GroupList', () => {

  let renderedTree = '';

  describe('render', ()=> {

      let sampleGroups = [{name: 'A group'}, {name: 'Another group'}];

    beforeEach( () => {
      renderedTree = sd.shallowRender(<GroupsList groups={sampleGroups} onSave={''}/>);
    });

    it('has a single ul with lis for each group provided', () => {
      let element = renderedTree.subTree('ul');
      expect(element).not.toBeFalsy();
      expect(element.props.children.length).toBe(2);
    });

  });
});
