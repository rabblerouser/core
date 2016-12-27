import React from 'react';
import { shallow } from 'enzyme';

import { AdminListTable } from '../AdminListTable';

describe('AdminListTable', () => {
  const admin = {
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
      <AdminListTable admins={[{ ...admin }]} />
    );

    const computedColumns = wrapper.find('SortedTable').prop('columns');
    expect(computedColumns).toEqual(expectedColumns);
  });

  it('should not create the table if there are no entries', () => {
    const wrapper = shallow(
      <AdminListTable admins={[]} />
    );
    expect(wrapper.find('SortedTable').length).toEqual(0);
  });
});
