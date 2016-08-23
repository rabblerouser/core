const csvGenerator = require('../../../src/lib/csvGenerator');

describe('csvGenerator', () => {
  it('has the fields as the first line', () => {
    expect(csvGenerator.generateCsv(['name', 'address'], [])).to.eql('name,address');
  });

  it('serialises fields from objects', () => {
    const objects = [
      { other: 'Foo', name: 'Bob', address: 'Here', phone: '123' },
      { phone: '456', address: 'There', other: 'Bar', name: 'Sally' },
      { address: 'Everywhere', other: 'Baz', name: 'Jane', phone: '789' },
    ];
    expect(csvGenerator.generateCsv(['name', 'address', 'phone'], objects)).to.eql(
      'name,address,phone\n' +
      'Bob,Here,123\n' +
      'Sally,There,456\n' +
      'Jane,Everywhere,789'
    );
  });

  it('handles commas in the data', () => {
    const objects = [{ phone: '123', 'lastname,firstname, middlename': 'Smith, John James' }];
    expect(csvGenerator.generateCsv(['lastname,firstname, middlename', 'phone'], objects)).to.eql(
      'lastname firstname middlename,phone\n' +
      'Smith John James,123'
    );
  });

  it('handles non-string values correctly', () => {
    const objects = [{ a: 123, b: null, c: undefined, d: 'a string' }];
    expect(csvGenerator.generateCsv(['a', 'b', 'c', 'd'], objects)).to.eql(
      'a,b,c,d\n' +
      '123,,,a string'
    );
  });
});
