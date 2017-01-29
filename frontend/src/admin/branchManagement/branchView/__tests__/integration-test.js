import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { changeInputValue, changeTextAreaValue, clickSubmit } from './DOMHelpers';
import { initialiseStore } from './integrationTestHelpers';
import BranchDetails, { reducers } from '../index';
import { AddButton, EditButton, DeleteButton, Modal } from '../../../common/';

describe('Branch View - Integration', () => {
  let rendered;
  let fakeServer;
  let store;

  const stub200 = (method, path, respJSON = '') => {
    fakeServer.respondWith(method, path, [200, { 'Content-Type': 'application/json' }, JSON.stringify(respJSON)]);
  };

  beforeEach(() => {
    fakeServer = sinon.fakeServer.create();
    fakeServer.respondImmediately = true;
    stub200('GET', '/admin/branches');

    spyOn(window, 'confirm').and.returnValue(true);
    store = initialiseStore(reducers, 'getBranchView');
    rendered = mount(<Provider store={store}><BranchDetails /></Provider>);
  });

  afterEach(() => {
    fakeServer.restore();
  });

  it('renders the details of the current branch', () => {
    const html = rendered.find(BranchDetails).html();
    expect(html).toContain('Test Branch');
    expect(html).toContain('Contact details for the branch');
    expect(html).toContain('Some notes about the branch');
  });

  it('lets me add a new branch', done => {
    stub200('POST', '/branches');

    const modal = rendered.find(Modal);
    const add = rendered.find(AddButton);
    add.simulate('click');
    expect(modal.prop('isOpen')).toEqual(true);

    changeInputValue('name', 'Test branch changed');
    changeTextAreaValue('contact', 'New contact details');
    changeTextAreaValue('notes', 'Some notes');
    clickSubmit();
    setTimeout(() => {
      expect(fakeServer.requests[0].method).toBe('POST');
      expect(fakeServer.requests[0].url).toBe('/branches');
      expect(fakeServer.requests[0].requestBody).toEqual(JSON.stringify({
        name: 'Test branch changed',
        contact: 'New contact details',
        notes: 'Some notes',
      }));
      expect(fakeServer.requests[1].url).toBe('/admin/branches');
      expect(modal.prop('isOpen')).toEqual(false);
      done();
    }, 0);
  });

  it('lets me edit a branch', done => {
    stub200('PUT', '/branches/1234');

    const modal = rendered.find(Modal);
    const edit = rendered.find(EditButton);
    edit.simulate('click');

    expect(modal.prop('isOpen')).toEqual(true);

    changeInputValue('name', 'Test branch changed');
    changeTextAreaValue('contact', 'New contact details');
    changeTextAreaValue('notes', 'Some notes');
    clickSubmit();
    setTimeout(() => {
      expect(fakeServer.requests[0].method).toBe('PUT');
      expect(fakeServer.requests[0].url).toBe('/branches/1234');
      expect(fakeServer.requests[0].requestBody).toEqual(JSON.stringify({
        id: '1234',
        name: 'Test branch changed',
        contact: 'New contact details',
        notes: 'Some notes',
      }));
      expect(fakeServer.requests[1].url).toBe('/admin/branches');
      expect(modal.prop('isOpen')).toEqual(false);
      done();
    }, 0);
  });

  it('lets me delete a branch', done => {
    stub200('DELETE', '/branches/1234');

    const del = rendered.find(DeleteButton);
    del.simulate('click');

    expect(window.confirm).toHaveBeenCalled();
    setTimeout(() => {
      expect(fakeServer.requests[0].method).toBe('DELETE');
      expect(fakeServer.requests[0]).toEqual(jasmine.objectContaining({
        url: '/branches/1234',
      }));
      expect(fakeServer.requests[1].url).toBe('/admin/branches');
      done();
    }, 0);
  });
});
