import React from 'react';
import { shallow } from 'enzyme';

import { EditAdminForm } from '../EditAdminForm';

describe('EditAdminForm', () => {
  let submitSpy;
  let rendered;

  beforeEach(() => {
    submitSpy = jasmine.createSpy();
    rendered = shallow(<EditAdminForm
      handleSubmit={submitSpy}
    />);
  });

  it('calls handle submit when the form is submited', () => {
    const form = rendered.find('form');
    form.simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });

  describe('when the admin is being created', () => {
    it('renders an email field', () => {
      rendered = shallow(<EditAdminForm isCreating />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'email' }).length).toEqual(1);
    });

    it('renders a name field', () => {
      rendered = shallow(<EditAdminForm isCreating />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'name' }).length).toEqual(1);
    });

    it('renders a phoneNumber field', () => {
      rendered = shallow(<EditAdminForm isCreating />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'phoneNumber' }).length).toEqual(1);
    });

    it('renders a password field', () => {
      rendered = shallow(<EditAdminForm isCreating />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'password' }).length).toEqual(1);
    });
  });

  describe('when the admin is being updated', () => {
    it('displays the email', () => {
      rendered = shallow(<EditAdminForm email="some.email@email.com" />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'email' }).length).toEqual(0);
      expect(rendered.text()).toContain('some.email@email.com');
    });

    it('renders a name field', () => {
      rendered = shallow(<EditAdminForm />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'name' }).length).toEqual(1);
    });

    it('renders a phoneNumber field', () => {
      rendered = shallow(<EditAdminForm />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'phoneNumber' }).length).toEqual(1);
    });

    it('renders a password field', () => {
      rendered = shallow(<EditAdminForm isCreating />);
      const fields = rendered.find('Field');
      expect(fields.find({ name: 'password' }).length).toEqual(1);
    });
  });
});
