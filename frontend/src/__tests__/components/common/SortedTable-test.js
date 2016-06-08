import React from 'react';
import SortedTable from '../../../components/common/SortedTable.jsx';
import sd from 'skin-deep';

describe('SortedTable', () => {
  let rendered;

  describe('render', () => {
    const columns = [{ field: 'toSort' }, { field: 'toLeave' }];
    const data = [
      { toSort: 2, toLeave: 1 }, { toSort: 3, toLeave: 3 }, { toSort: 1, toLeave: 2 },
    ];
    const sorted = [
      { toSort: 1, toLeave: 2 }, { toSort: 2, toLeave: 1 }, { toSort: 3, toLeave: 3 },
    ];

    describe('when there is a sortOn provided', () => {
      const sortOn = 'toSort';

      beforeEach(() => {
        rendered = sd.shallowRender(<SortedTable columns={columns} data={data} sortOn={sortOn} />);
      });

      it('should render a Table ', () => {
        const renderedTable = rendered.subTree('Table');
        expect(renderedTable).not.toBeFalsy();
      });

      it('should pass a sorted set of data to the table', () => {
        const renderedTable = rendered.subTree('Table');
        expect(renderedTable.props.data).toEqual(sorted);
      });
    });

    describe('when there is no sortOn', () => {
      beforeEach(() => {
        rendered = sd.shallowRender(<SortedTable columns={columns} data={data} />);
      });

      it('should pass the data as is to the table', () => {
        const renderedTable = rendered.subTree('Table');
        expect(renderedTable.props.data).toEqual(data);
      });
    });

    describe('when the sortOn field does not match a header', () => {
      beforeEach(() => {
        rendered = sd.shallowRender(<SortedTable columns={columns} data={data} sortOn="unknownField" />);
      });

      it('should pass the data as is to the table', () => {
        const renderedTable = rendered.subTree('Table');
        expect(renderedTable.props.data).toEqual(data);
      });
    });
  });
});
