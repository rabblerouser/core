import React from 'react';
import { BranchActions } from '../BranchActions';
import { shallow } from 'enzyme';

import { Modal } from '../../../common';

describe('<BranchActions />', () => {
  const add = () => {};
  const edit = () => {};
  const handleClose = () => {};
  const remove = jasmine.createSpy();
  let rendered;

  beforeEach(() => {
    rendered = shallow(
      <BranchActions
        add={add}
        edit={edit}
        remove={remove}
        branch={{}}
        isModalOpen
        handleCloseModal={handleClose}
      />,
    );
  });

  it('renders an AddButton with the provided add prop', () => {
    const addButton = rendered.find('AddButton');
    expect(addButton.props().onClick).toEqual(add);
  });

  it('renders an EditButton with the provided edit prop', () => {
    const editButton = rendered.find('EditButton');
    expect(editButton.props().onClick).toEqual(edit);
  });

  it('renders a DeleteButton with the provided remove prop', () => {
    const deleteButton = rendered.find('DeleteButton');
    expect(deleteButton.props().onDelete).toEqual(remove);
  });

  it('renders a Modal with the provided close and isOpen prop', () => {
    const modal = rendered.find(Modal);
    expect(modal.props().isOpen).toEqual(true);
    expect(modal.props().handleClose).toEqual(handleClose);
  });
});
