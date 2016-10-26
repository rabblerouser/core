import React from 'react';
import { SelectedBranchActions } from '../SelectedBranchActions';
import { shallow } from 'enzyme';

describe('SelectedBranchActions', () => {
  let rendered;

  const branch = {};
  const add = () => {};
  const edit = () => {};
  const remove = jasmine.createSpy();

  beforeEach(() => {
    rendered = shallow(<SelectedBranchActions
      addBranch={add}
      editBranch={edit}
      branchRemoveRequested={remove}
      branch={branch}
    />);
  });

  it('renders an AddButton with the provided add prop', () => {
    const addButton = rendered.find('AddButton');
    expect(addButton.props().onClick).toEqual(add);
  });

  it('renders an EditButton with the provided edit prop', () => {
    const editButton = rendered.find('EditButton');
    expect(editButton.props().onClick).toEqual(edit);
  });

  it('renders a DeleteButton with the remove and branch props', () => {
    const deleteButton = rendered.find('DeleteButton');
    deleteButton.props().onDelete();
    expect(remove).toHaveBeenCalledWith(branch);
  });
});
