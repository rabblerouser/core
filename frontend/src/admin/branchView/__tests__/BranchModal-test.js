import React from 'react';
import { BranchModal } from '../BranchModal';
import { shallow } from 'enzyme';
import EditBranchForm from '../EditBranchForm';

describe('BranchModal', () => {
  let rendered;
  const isOpen = true;
  const onClose = () => {};

  beforeEach(() => {
    rendered = shallow(<BranchModal isOpen={isOpen} handleClose={onClose} />);
  });

  it('renders a modal with isOpen and onRequestClose mapped props', () => {
    const modal = rendered.find('Modal');
    expect(modal.props().isOpen).toEqual(isOpen);
    expect(modal.props().onRequestClose).toEqual(onClose);
  });

  it('renders an edit branch form', () => {
    expect(rendered.find(EditBranchForm).length).toEqual(1);
  });
});
