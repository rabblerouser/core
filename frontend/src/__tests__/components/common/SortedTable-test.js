import React from 'react';
import SortedTable from '../../../components/common/SortedTable.jsx';
import { shallow } from 'enzyme';

describe('SortedTable', () => {
  const columns = [{ field: 'toSort' }, { field: 'toLeave' }];
  const data = [
    { toSort: 2, toLeave: 1 }, { toSort: 3, toLeave: 3 }, { toSort: 1, toLeave: 2 },
  ];

  describe('when there is a sortOn provided', () => {
    const sorted = [
      { toSort: 1, toLeave: 2 }, { toSort: 2, toLeave: 1 }, { toSort: 3, toLeave: 3 },
    ];

    it('should render a table with sorted data', () => {
      const table = shallow(<SortedTable columns={columns} data={data} sortOn="toSort" />).find('Table');
      expect(table.length).toBe(1);
      expect(table.prop('data')).toEqual(sorted);
    });
  });

  describe('when there is no sortOn', () => {
    it('should render a table with the data unsorted', () => {
      const table = shallow(<SortedTable columns={columns} data={data} />).find('Table');
      expect(table.length).toBe(1);
      expect(table.prop('data')).toEqual(data);
    });
  });

  describe('when the sortOn field does not match a header', () => {
    it('should pass the data as is to the table', () => {
      const table = shallow(<SortedTable columns={columns} data={data} sortOn="unknownField" />).find('Table');
      expect(table.prop('data')).toEqual(data);
    });
  });
});
