import React from 'react';
import { GroupView } from '../GroupView';
import { shallow } from 'enzyme';

describe('GroupView', () => {
  let rendered;
  const create = () => {};
  const requestGroupList = jasmine.createSpy();

  beforeEach(() => {
    rendered = shallow(<GroupView
      branchId="1"
      create={create}
      requestGroupList={requestGroupList}
    />);
  });

  it('renders an AddButton with the provided add prop', () => {
    const addButton = rendered.find('AddButton');
    expect(addButton.props().onClick).toEqual(create);
  });

  describe('when the branchId provided changes', () => {
    it('calls the request group list prop', () => {
      expect(requestGroupList.calls.count()).toEqual(0);
      rendered.setProps({ branchId: '2' });
      expect(requestGroupList.calls.count()).toEqual(1);
    });
  });
});
