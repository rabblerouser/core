import React from 'react';
import { BranchActions } from '../BranchActions';
import { shallow } from 'enzyme';

describe('<BranchActions />', () => {
  let rendered;

  const branch = {};
  const add = () => {};
  const edit = () => {};
  const remove = jasmine.createSpy();

  beforeEach(() => {
    rendered = shallow(
      <BranchActions add={add} edit={edit} remove={remove} branch={branch} />
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

  it('renders an DeleteButton with the provided remove prop', () => {
    const deleteButton = rendered.find('DeleteButton');
    expect(deleteButton.props().onDelete).toEqual(remove);
  });
});
