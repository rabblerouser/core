import React from 'react';
import { shallow } from 'enzyme';
import EditMemberFields from '../EditMemberFields';

describe('EditMemberFields', () => {
  const DETAILS_SECTION = 'details';

  describe('address is enabled', () => {
    it('should display address input fields', () => {
      const wrapper = shallow(
        <EditMemberFields
          invalidFields={[]} onChange={() => {}} formValues={{}} groups={[]}
          selectedSection={DETAILS_SECTION} onSelectSection={() => {}} addressEnabled
        />
      );

      expect(wrapper.find('#address').length).toEqual(1);
      expect(wrapper.find('#suburb').length).toEqual(1);
      expect(wrapper.find('#state').length).toEqual(1);
      expect(wrapper.find('#postcode').length).toEqual(1);
      expect(wrapper.find('#country').length).toEqual(1);
    });
  });

  describe('address is disabled', () => {
    it('should *not* display address input fields', () => {
      const wrapper = shallow(
        <EditMemberFields
          invalidFields={[]} onChange={() => {}} formValues={{}} groups={[]}
          selectedSection={DETAILS_SECTION} onSelectSection={() => {}} addressEnabled={false}
        />
      );

      expect(wrapper.find('input#address').length).toEqual(0);
      expect(wrapper.find('input#suburb').length).toEqual(0);
      expect(wrapper.find('input#country').length).toEqual(0);
      expect(wrapper.find('input#state').length).toEqual(0);
      expect(wrapper.find('input#postcode').length).toEqual(0);
    });
  });
});
