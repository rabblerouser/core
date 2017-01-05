import React from 'react';
import { shallow } from 'enzyme';
import Table from '../Table';

describe('Table', () => {
  let rendered;

  describe('render', () => {
    const data = [{ key: '' }, { key: '' }];
    const columns = [{ key: '' }, { key: '' }, { key: '' }];

    beforeEach(() => {
      rendered = shallow(<Table columns={columns} data={data} />);
    });

    it('creates a row for each datum', () => {
      const renderedRows = rendered.find('tbody tr');
      expect(renderedRows.length).toBe(data.length);
    });

    it('creates a column for each column', () => {
      const renderedColumns = rendered.find('ColumnHeader');
      expect(renderedColumns.length).toBe(columns.length);
    });
  });
});
