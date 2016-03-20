'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import GroupsList from '../../../components/admin/GroupsList.jsx';
import sd from 'skin-deep';

describe('GroupList', () => {

  let renderedTree = '';

  describe('render', ()=> {

      let sampleGroups = [{name: 'A group'}, {name: 'Another group'}];

    beforeEach( () => {
      renderedTree = sd.shallowRender(<GroupsList groups={sampleGroups} onSave={''}/>);
    });

    xit('has a single select element with options for each group provided plus the All Participants option', () => {
      let element = renderedTree.subTree('select');
      expect(element).not.toBeFalsy();
      console.log('>>>>>>>>>>>>>',element.toString());
      console.log('>>>>>>>>>>>>>',element.props.children);
      expect(element.props.children.length).toBe(3);
    });

  });
});
