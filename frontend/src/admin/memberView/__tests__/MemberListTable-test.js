import React from 'react';
import { shallow } from 'enzyme';

import MemberListTable from '../MemberListTable';
import { parsedMemberWithPostalAddress, parsedMemberWithNullPostalAddress } from
 '../../adapters/__tests__/memberAdapter-test';

describe('MemberListTable', () => {
  const columnsWithoutAddress = [
    { type: 'name', field: 'memberName', label: 'Member name' },
    { type: 'name', field: 'contactNumber', label: 'Contact information' },
    { type: 'name', field: 'memberSince', label: 'Member since' },
    { type: 'actions' },
  ];

  const columnsWithAddress = [
    { type: 'name', field: 'memberName', label: 'Member name' },
    { type: 'name', field: 'contactNumber', label: 'Contact information' },
    { type: 'name', field: 'postalAddress', label: 'Postal Address' },
    { type: 'name', field: 'memberSince', label: 'Member since' },
    { type: 'actions' },
  ];

  describe('when address is enabled', () => {
    it('create a table with a postal address column', () => {
      const members = [parsedMemberWithPostalAddress()];

      const wrapper = shallow(
        <MemberListTable
          members={members} groups={[]}
          onSaveMember={() => {}} onDeleteMember={() => {}} addressEnabled
        />
      );

      const computedColumns = wrapper.find('SortedTable').prop('columns');
      expect(computedColumns).toEqual(columnsWithAddress);
    });

    it('a member with no postal address should have a "no postal address" special value printed', () => {
      const members = [parsedMemberWithNullPostalAddress()];

      const wrapper = shallow(
        <MemberListTable
          members={members} groups={[]}
          onSaveMember={() => {}} onDeleteMember={() => {}} addressEnabled
        />
      );

      const computedData = wrapper.find('SortedTable').prop('data');
      const computedAddressString = computedData[0].postalAddress;
      expect(computedAddressString).toEqual('-');
    });

    it('a member with a postal address should have a pretty version of it displayed', () => {
      const members = [parsedMemberWithPostalAddress()];

      const wrapper = shallow(
        <MemberListTable
          members={members} groups={[]}
          onSaveMember={() => {}} onDeleteMember={() => {}} addressEnabled
        />
      );

      const computedData = wrapper.find('SortedTable').prop('data');
      const computedAddressString = computedData[0].postalAddress;
      expect(computedAddressString).toEqual('303 Collins St, Melbourne, Victoria, 3000, Australia');
    });
  });

  describe('when address is not enabled', () => {
    it('create a table with no postal address column', () => {
      const members = [parsedMemberWithNullPostalAddress()];

      const wrapper = shallow(
        <MemberListTable
          members={members} groups={[]}
          onSaveMember={() => {}} onDeleteMember={() => {}} addressEnabled={false}
        />
      );

      const computedColumns = wrapper.find('SortedTable').prop('columns');
      expect(computedColumns).toEqual(columnsWithoutAddress);
    });

    it('do not pass address into the table data prop', () => {
      const members = [parsedMemberWithNullPostalAddress()];

      const wrapper = shallow(
        <MemberListTable
          members={members} groups={[]}
          onSaveMember={() => {}} onDeleteMember={() => {}} addressEnabled={false}
        />
      );

      const computedData = wrapper.find('SortedTable').prop('data');
      const computedFirstRow = computedData[0];
      expect(computedFirstRow.postalAddress).toBeUndefined();
    });
  });
});
