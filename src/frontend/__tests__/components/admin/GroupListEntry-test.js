'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import GroupListEntry from '../../../components/admin/GroupListEntry.jsx';
import EditGroupModalLauncher from '../../../components/admin/EditGroupModalLauncher.jsx';

import sd from 'skin-deep';

describe('GroupListEntry', () => {

  let renderedTree = '';
  let group = {name: 'here is the name of the group'};

  describe('render', ()=> {

    beforeEach( () => {
      renderedTree = sd.shallowRender(<GroupListEntry group={ group }/>);
    });

    // it('has an edit modal and a span for the name of the group', () => {
    //   let element = renderedTree.subTree('li');
    //   expect(element).not.toBeFalsy();
    //   expect(element.props.children[0].type).toBe('span');
    //   expect(element.props.children[1].type).toBe(EditGroupModalLauncher);
    // });

  });
});
