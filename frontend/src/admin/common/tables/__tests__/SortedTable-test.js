import React from 'react';
import { mount } from 'enzyme';
import SortedTable from '../SortedTable';
import Table from '../Table';

describe('SortedTable', () => {
  const columns = [{ field: 'toSort' }, { field: 'toLeave' }];
  const data = [{ toSort: 2 }, { toSort: 3 }, { toSort: 1 }];
  const sorted = [{ toSort: 1 }, { toSort: 2 }, { toSort: 3 }];

  it('should render a table with the sorted data', () => {
    const table = mount(<SortedTable columns={columns} data={data} sortOn="toSort" />).find(Table);
    expect(table.length).toBe(1);
    expect(table.prop('data')).toEqual(sorted);
  });

  it('should display that there are no entries if there are none', () => {
    const rendered = mount(<SortedTable columns={columns} data={[]} sortOn="toSort" />);
    expect(rendered.text()).toContain('No entries found');
  });
});
