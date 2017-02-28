import React from 'react';
import { shallow } from 'enzyme';

import { EditMemberForm } from '../EditMemberForm';

describe('EditMemberForm', () => {
  let submitSpy;
  let rendered;

  beforeEach(() => {
    submitSpy = jasmine.createSpy();
    rendered = shallow(<EditMemberForm
      groupOptions={[{ name: 'first', id: '1' }, { name: 'second', id: '2' }]}
      handleSubmit={submitSpy}
      memberSince="01/01/2000"
    />);
  });


  it('renders the member since date', () => {
    expect(rendered.text()).toContain('01/01/2000');
  });


  it('calls handle submit when the form is submited', () => {
    const form = rendered.find('form');
    form.simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });

  [
    'name',
    'email',
    'phoneNumber',
    'notes',
    'additionalInfo',
  ].forEach(fieldName =>
    it(`renders the ${fieldName} field`, () => {
      const fields = rendered.find('Field');
      expect(fields.find({ name: fieldName }).length).toEqual(1);
    }),
  );

  it('renders the groups field with each option', () => {
    const fields = rendered.find('Field');
    expect(fields.find({ name: 'groups' }).length).toEqual(1);
    expect(fields.find({ name: 'groups' }).find('option').length).toEqual(2);
  });

  describe('when address is not enabled', () => {
    beforeEach(() => {
      submitSpy = jasmine.createSpy();
      rendered = shallow(<EditMemberForm groupOptions={[]} />);
    });

    [
      'address.address',
      'address.suburb',
      'address.postcode',
      'address.state',
      'address.country',
    ].forEach(fieldName =>
      it(`does not render the ${fieldName} field`, () => {
        const fields = rendered.find('Field');
        expect(fields.find({ name: fieldName }).length).toEqual(0);
      }),
    );
  });


  describe('when address is enabled', () => {
    beforeEach(() => {
      submitSpy = jasmine.createSpy();
      rendered = shallow(<EditMemberForm groupOptions={[]} addressEnabled />);
    });

    [
      'address.address',
      'address.suburb',
      'address.postcode',
      'address.state',
      'address.country',
    ].forEach(fieldName =>
      it(`renders the ${fieldName} field`, () => {
        const fields = rendered.find('Field');
        expect(fields.find({ name: fieldName }).length).toEqual(1);
      }),
    );
  });
});
