import React from 'react';
import { shallow } from 'enzyme';
import { GroupActions } from '../GroupActions';

describe('<GroupActions />', () => {
  let rendered;

  const branch = {};
  const edit = () => {};
  const remove = jasmine.createSpy();

  beforeEach(() => {
    rendered = shallow(
      <GroupActions edit={edit} remove={remove} branch={branch} />,
    );
  });

  it('renders an EditButton with the provided edit prop', () => {
    const editButton = rendered.find('EditButton');
    expect(editButton.props().onClick).toEqual(edit);
  });

  it('renders a DeleteButton with the provided remove prop', () => {
    const deleteButton = rendered.find('DeleteButton');
    expect(deleteButton.props().onDelete).toEqual(remove);
  });
});
