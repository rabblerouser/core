import React from 'react';
import { shallow } from 'enzyme';
import DeleteButton from '../DeleteButton.jsx';

describe('DeleteButton', () => {
  let onDelete;
  let deleteButton;

  beforeEach(() => {
    onDelete = jasmine.createSpy('onDelete');
    deleteButton = shallow(<DeleteButton
      confirmMessage="Really?"
      onDelete={onDelete}
      title="delete button"
    />);
  });

  it('calls the callback when the user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    deleteButton.find('button').simulate('click');

    expect(onDelete).toHaveBeenCalled();
  });

  it('does not call the callback when the user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    deleteButton.find('button').simulate('click');

    expect(onDelete).not.toHaveBeenCalled();
  });
});
