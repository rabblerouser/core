import React from 'react';
import Table from '../../../components/common/Table.jsx';
import sd from 'skin-deep';

describe('Table', () => {
  let rendered;

  describe('render', () => {
    describe('when there is data', () => {
      const data = [{ key: '' }, { key: '' }];
      const columns = [{ key: '' }, { key: '' }, { key: '' }];

      beforeEach(() => {
        rendered = sd.shallowRender(<Table columns={columns} data={data} />);
      });

      it('creates a row for each datum', () => {
        const renderedRows = rendered.subTree('tbody').everySubTree('tr');
        expect(renderedRows.length).toBe(data.length);
      });

      it('creates a column for each column', () => {
        const renderedColumns = rendered.everySubTree('ColumnHeader');
        expect(renderedColumns.length).toBe(columns.length);
      });
    });

    describe('when there is no data', () => {
      beforeEach(() => {
        rendered = sd.shallowRender(<Table columns={[]} data={[]} />);
      });

      it('has a message that there are no entries', () => {
        expect(rendered.text()).toContain('No entries found');
      });
    });
  });
});
