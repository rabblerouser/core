import sortColumn from '../../../lib/sortColumn';
import { sortByOrder } from 'lodash';

describe('sortColumn', () => {
  it('sorts case-insensitively', () => {
    const data = [
      { name: 'crep' },
      { name: 'Bllop' },
      { name: 'Dart' },
    ];
    expect(sortColumn.sort(data, { property: 'name', sort: 'asc' }, sortByOrder))
      .toEqual([{ name: 'Bllop' }, { name: 'crep' }, { name: 'Dart' }]);
  });

  it('maintains header classes after sort', () => {
    const columns = [{
      property: 'name',
      headerClass: 'foo',
    }];
    sortColumn(columns, columns[0], () => {
      expect(columns[0].headerClass).toContain('foo');
    });
  });
});
