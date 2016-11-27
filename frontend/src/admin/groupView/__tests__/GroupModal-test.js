import React from 'react';
import { GroupModal } from '../GroupModal';
import { shallow } from 'enzyme';
import EditGroupForm from '../EditGroupForm';

describe('GroupModal', () => {
  let rendered;
  const isOpen = true;
  const onClose = () => {};

  beforeEach(() => {
    rendered = shallow(<GroupModal isOpen={isOpen} handleClose={onClose} />);
  });

  it('renders a modal with isOpen and onRequestClose mapped props', () => {
    const modal = rendered.find('Modal');
    expect(modal.props().isOpen).toEqual(isOpen);
    expect(modal.props().onRequestClose).toEqual(onClose);
  });

  it('renders an edit group form', () => {
    expect(rendered.find(EditGroupForm).length).toEqual(1);
  });
});
