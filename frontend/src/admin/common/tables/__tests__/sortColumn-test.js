import sortColumn from '../sortColumn';

describe('sortColumn', () => {
  const columns = [{ field: 'toSort' }, { field: 'toLeave' }];

  it('sorts case-insensitively', () => {
    const sorted = sortColumn('toSort', columns, [{ toSort: 'B' }, { toSort: 'a' }, { toSort: 'c' }]);
    expect(sorted.data).toEqual([{ toSort: 'a' }, { toSort: 'B' }, { toSort: 'c' }]);
  });

  it('sets the direction on the columns', () => {
    const sorted = sortColumn('toSort', columns, [{ toSort: 'B' }, { toSort: 'a' }, { toSort: 'c' }]);
    expect(sorted.columns).toEqual([{ field: 'toSort', direction: 'asc' }, { field: 'toLeave', direction: 'none' }]);
  });

  it('should return the data unchanged if the field isn\'t present', () => {
    const sorted = sortColumn('unknown', columns, [{ toSort: 'B' }, { toSort: 'a' }, { toSort: 'c' }]);
    expect(sorted.data).toEqual([{ toSort: 'B' }, { toSort: 'a' }, { toSort: 'c' }]);
  });
});
