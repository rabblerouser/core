import React from 'react';
import SortedTable from '../SortedTable';
import { shallow } from 'enzyme';

describe('SortedTable', () => {
  const columns = [{ field: 'toSort' }, { field: 'toLeave' }];
  const data = [{ toSort: 2 }, { toSort: 3 }, { toSort: 1 }];
  const sorted = [{ toSort: 1 }, { toSort: 2 }, { toSort: 3 }];

  it('should render a table with the sorted data', () => {
    const table = shallow(<SortedTable columns={columns} data={data} sortOn="toSort" />).find('Table');
    expect(table.length).toBe(1);
    expect(table.prop('data')).toEqual(sorted);
  });
});
