import React from 'react';
import { shallow } from 'enzyme';

import EditMemberForm from '../EditMemberForm';
import {
 completePostalAddress,
 parsedMemberWithPostalAddress,
 parsedMemberWithNullPostalAddress,
} from '../../adapters/__tests__/memberAdapter-test';


describe('EditMemberForm', () => {
  describe('when address is enabled', () => {
    it('should turn null postal address into empty string fieldValues', () => {
      const wrapper = shallow(
        <EditMemberForm
          member={parsedMemberWithNullPostalAddress()} onSuccess={() => {}}
          onSave={() => {}} addressEnabled
        />
      );

      const fieldValues = wrapper.find('EditMemberFields').prop('formValues');
      expect(fieldValues.address).toEqual('');
      expect(fieldValues.suburb).toEqual('');
      expect(fieldValues.state).toEqual('');
      expect(fieldValues.postcode).toEqual('');
      expect(fieldValues.country).toEqual('');
    });

    it('should turn complete postal address into flattened fieldValues', () => {
      const member = parsedMemberWithPostalAddress();
      const expectedAddress = member.postalAddress;
      const wrapper = shallow(
        <EditMemberForm
          member={member} onSuccess={() => {}} onSave={() => {}} addressEnabled
        />
      );

      const fieldValues = wrapper.find('EditMemberFields').prop('formValues');
      expect(fieldValues.address).toEqual(expectedAddress.address);
      expect(fieldValues.suburb).toEqual(expectedAddress.suburb);
      expect(fieldValues.state).toEqual(expectedAddress.state);
      expect(fieldValues.postcode).toEqual(expectedAddress.postcode);
      expect(fieldValues.country).toEqual(expectedAddress.country);
    });

    describe('and the member is saved without making changes', () => {
      it('should preserve the member with a null postalAddress', () => {
        const memberNullAddress = parsedMemberWithNullPostalAddress();
        const onSaveSpy = sinon.spy();
        const wrapper = shallow(
          <EditMemberForm
            member={memberNullAddress} onSuccess={() => {}}
            onSave={onSaveSpy} addressEnabled
          />
        );
        wrapper.instance().saveChanges();
        expect(onSaveSpy.calledWith(memberNullAddress)).toBeTruthy();
      });

      it('should preserve the member with a complete postalAddress', () => {
        const memberCompleteAddress = parsedMemberWithPostalAddress();
        const onSaveSpy = sinon.spy();
        const wrapper = shallow(
          <EditMemberForm
            member={memberCompleteAddress} onSuccess={() => {}}
            onSave={onSaveSpy} addressEnabled
          />
        );
        wrapper.instance().saveChanges();
        expect(onSaveSpy.calledWith(memberCompleteAddress)).toBeTruthy();
      });
    });

    it('should save a member with cleared address correctly', () => {
      const member = parsedMemberWithPostalAddress();
      const onSaveSpy = sinon.spy();
      const wrapper = shallow(
        <EditMemberForm
          member={member} onSuccess={() => {}}
          onSave={onSaveSpy} addressEnabled
        />
      );

      const onChange = wrapper.find('EditMemberFields').props().onChange;
      const saveChanges = wrapper.find('button.save').props().onClick;

      const fakeClearValueEvent = { target: { value: '' } };
      onChange('address')(fakeClearValueEvent);
      onChange('suburb')(fakeClearValueEvent);
      onChange('state')(fakeClearValueEvent);
      onChange('postcode')(fakeClearValueEvent);
      onChange('country')(fakeClearValueEvent);
      saveChanges();

      const expectedMember = Object.assign({}, member, { postalAddress: null });
      expect(onSaveSpy.calledWith(expectedMember)).toBeTruthy();
    });

    it('should save a member with a newly filled out address correctly', () => {
      const member = parsedMemberWithNullPostalAddress();
      const onSaveSpy = sinon.spy();
      const wrapper = shallow(
        <EditMemberForm
          member={member} onSuccess={() => {}}
          onSave={onSaveSpy} addressEnabled
        />
      );

      const onChange = wrapper.find('EditMemberFields').props().onChange;
      const saveChanges = wrapper.find('button.save').props().onClick;

      const newPostalAddress = completePostalAddress();
      const eventWithValue = value => ({ target: { value } });
      onChange('address')(eventWithValue(newPostalAddress.address));
      onChange('suburb')(eventWithValue(newPostalAddress.suburb));
      onChange('state')(eventWithValue(newPostalAddress.state));
      onChange('postcode')(eventWithValue(newPostalAddress.postcode));
      onChange('country')(eventWithValue(newPostalAddress.country));
      saveChanges();

      const expectedMember = Object.assign({}, member, { postalAddress: newPostalAddress });
      expect(onSaveSpy.calledWith(expectedMember)).toBeTruthy();
    });
  });
});
