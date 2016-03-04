'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import GroupListEntry from '../../../components/admin/GroupListEntry.jsx';
import sd from 'skin-deep';

describe('GroupListEntry', () => {

  let renderedTree = '';
  let group = {name: 'here is the name of the group'};

  describe('render', ()=> {

    beforeEach( () => {
      renderedTree = sd.shallowRender(<GroupListEntry group={ group }/>);
    });

    it('has a single li with the name of the group', () => {
      let element = renderedTree.subTree('li');
      expect(element).not.toBeFalsy();
      expect(element.text()).toBe('here is the name of the group');
    });

  });
});
