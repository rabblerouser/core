import React from 'react';
import { shallow } from 'enzyme';
import { GroupView } from '../GroupView';

import { Modal } from '../../../common';

describe('GroupView', () => {
  let rendered;
  const create = () => {};
  const handleClose = () => {};
  const requestGroupList = jasmine.createSpy();

  beforeEach(() => {
    rendered = shallow(<GroupView
      branchId="1"
      create={create}
      requestGroupList={requestGroupList}
      isModalOpen
      handleCloseModal={handleClose}
    />);
  });

  it('renders an AddButton with the provided add prop', () => {
    const addButton = rendered.find('AddButton');
    expect(addButton.props().onClick).toEqual(create);
  });

  it('renders a Modal with the provided close and isOpen prop', () => {
    const modal = rendered.find(Modal);
    expect(modal.props().isOpen).toEqual(true);
    expect(modal.props().handleClose).toEqual(handleClose);
  });

  describe('when the branchId provided changes', () => {
    it('calls the request group list prop', () => {
      expect(requestGroupList.calls.count()).toEqual(0);
      rendered.setProps({ branchId: '2' });
      expect(requestGroupList.calls.count()).toEqual(1);
    });
  });
});
