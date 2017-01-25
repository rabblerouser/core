import React from 'react';
import { shallow } from 'enzyme';
import { EditGroupForm } from '../EditGroupForm';

describe('EditGroupForm', () => {
  let submitSpy;
  let rendered;

  beforeEach(() => {
    submitSpy = jasmine.createSpy();
    rendered = shallow(<EditGroupForm handleSubmit={submitSpy} />);
  });

  it('renders a form title', () => {
    expect(rendered.find('FormHeaderWithSave').html()).toContain(
'Group details');
  });

  it('renders the name, contact and notes fields', () => {
    const fields = rendered.find('Field');
    expect(fields.find({ name: 'name' }).length).toEqual(1);
    expect(fields.find({ name: 'description' }).length).toEqual(1);
  });

  it('calls handle submit when the form is submited', () => {
    const form = rendered.find('form');
    form.simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });
});
