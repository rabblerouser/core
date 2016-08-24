import React from 'react';
import { EditBranchForm } from '../EditBranchForm';
import { shallow } from 'enzyme';

describe('EditBranchForm', () => {
  let submitSpy;
  let rendered;

  beforeEach(() => {
    submitSpy = jasmine.createSpy();
    rendered = shallow(<EditBranchForm handleSubmit={submitSpy} />);
  });

  it('renders a form title', () => {
    expect(rendered.find('.title').text()).toEqual('Branch details');
  });

  it('renders a save button', () => {
    expect(rendered.find('button[type="submit"]').length).toEqual(1);
  });

  it('renders the name, contact and notes fields', () => {
    const fields = rendered.find('Field');
    expect(fields.find({ name: 'name' }).length).toEqual(1);
    expect(fields.find({ name: 'contact' }).length).toEqual(1);
    expect(fields.find({ name: 'notes' }).length).toEqual(1);
  });

  it('calls handle submit when the form is submited', () => {
    const form = rendered.find('form');
    form.simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });
});
