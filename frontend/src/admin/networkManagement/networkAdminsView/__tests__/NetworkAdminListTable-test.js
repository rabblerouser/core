import React from 'react';
import { shallow } from 'enzyme';

import { NetworkAdminListTable } from '../NetworkAdminListTable';

describe('NetworkAdminListTable', () => {
  const networkAdmin = {
    id: '1',
    name: 'Jo jo',
    phoneNumber: '101010010',
    email: 'jo@jo.com',
  };

  const expectedColumns = [
      { type: 'name', field: 'name', label: 'Name' },
      { type: 'email', field: 'email', label: 'Email' },
      { type: 'tel', field: 'phoneNumber', label: 'Phone' },
      { type: 'actions' },
  ];

  it('create a table with name, email, tel and action columns', () => {
    const wrapper = shallow(
      <NetworkAdminListTable networkAdmins={[{ ...networkAdmin }]} />
    );

    const computedColumns = wrapper.find('SortedTable').prop('columns');
    expect(computedColumns).toEqual(expectedColumns);
  });

  it('should not create the table if there are no entries', () => {
    const wrapper = shallow(
      <NetworkAdminListTable networkAdmins={[]} />
    );
    expect(wrapper.find('SortedTable').length).toEqual(0);
  });
});
