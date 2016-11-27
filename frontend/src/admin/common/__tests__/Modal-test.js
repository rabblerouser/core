import React from 'react';
import { shallow } from 'enzyme';
import Modal from '../Modal';

describe('Modal', () => {
  let rendered;
  const isOpen = true;
  const onClose = () => {};

  beforeEach(() => {
    rendered = shallow(<Modal isOpen={isOpen} handleClose={onClose}><form /></Modal>);
  });

  it('renders a modal with isOpen and onRequestClose mapped props', () => {
    const modal = rendered.find('Modal');
    expect(modal.props().isOpen).toEqual(isOpen);
    expect(modal.props().onRequestClose).toEqual(onClose);
  });

  it('renders the provided children', () => {
    expect(rendered.find('form').length).toEqual(1);
  });
});
