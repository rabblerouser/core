import React from 'react';
import { shallow } from 'enzyme';

import { MemberListTable } from '../MemberListTable';

describe('MemberListTable', () => {
  const member = {
    id: '1',
    name: 'Jo Jo The 3rd',
    phoneNumber: '101010010',
    email: 'jo@jo.com',
    memberSince: '2016-03-08T22:34:23.721Z',
    additionalInfo: 'Some additional info',
    notes: 'Some notes',
    groups: [{ id: 1, name: 'Group name' }],
    branchId: '1234',
  };

  describe('when address is enabled', () => {
    it('create a table with an address column', () => {
      const expectedColumns = [
        { type: 'name', field: 'memberName', label: 'Member name' },
        { type: 'name', field: 'contactNumber', label: 'Contact information' },
        { type: 'name', field: 'address', label: 'Address' },
        { type: 'name', field: 'memberSince', label: 'Member since' },
        { type: 'actions' },
      ];
      const wrapper = shallow(
        <MemberListTable
          members={[{ ...member }]}
          groups={[]}
          onEdit={() => {}}
          onDeleteMember={() => {}}
          addressEnabled
        />,
      );

      const computedColumns = wrapper.find('SortedTable').prop('columns');
      expect(computedColumns).toEqual(expectedColumns);
    });

    it('a member with an address should have a pretty version of it displayed', () => {
      const address = {
        address: '303 Collins St',
        suburb: 'Melbourne',
        state: 'Victoria',
        postcode: '3000',
        country: 'Australia',
      };

      const wrapper = shallow(
        <MemberListTable
          members={[{ ...member, address }]}
          groups={[]}
          onEdit={() => {}}
          onDeleteMember={() => {}}
          addressEnabled
        />,
      );

      const computedData = wrapper.find('SortedTable').prop('data');
      const computedAddressString = computedData[0].address;
      expect(computedAddressString).toEqual('303 Collins St, Melbourne, Victoria, 3000, Australia');
    });

    it('a member with no address should have a "no address" special value printed', () => {
      const wrapper = shallow(
        <MemberListTable
          members={[{ ...member }]}
          groups={[]}
          onEdit={() => {}}
          onDeleteMember={() => {}}
          addressEnabled
        />,
      );

      const computedData = wrapper.find('SortedTable').prop('data');
      const computedAddressString = computedData[0].address;
      expect(computedAddressString).toEqual('-');
    });
  });

  describe('when address is not enabled', () => {
    const expectedColumns = [
      { type: 'name', field: 'memberName', label: 'Member name' },
      { type: 'name', field: 'contactNumber', label: 'Contact information' },
      { type: 'name', field: 'memberSince', label: 'Member since' },
      { type: 'actions' },
    ];

    it('create a table with no address column', () => {
      const wrapper = shallow(
        <MemberListTable
          members={[{ ...member }]}
          groups={[]}
          onEdit={() => {}}
          onDeleteMember={() => {}}
        />,
      );

      const computedColumns = wrapper.find('SortedTable').prop('columns');
      expect(computedColumns).toEqual(expectedColumns);
    });
  });
});
