import branchAdapter from '../../adapters/branchAdapter.js';

describe('branchAdapter', () => {
  describe('parseBranches', () => {
    const validResult = [
      {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        name: 'Branch 1',
        notes: 'note',
        contact: 'somebody',
      },
      {
        id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
        name: 'Branch 2',
        notes: 'note',
        contact: 'somebody',
      },
    ];

    describe('when the payload is valid', () => {
      const validPayload = {
        branches: [
          {
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Branch 1',
            notes: 'note',
            contact: 'somebody',
          },
          {
            id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
            name: 'Branch 2',
            notes: 'note',
            contact: 'somebody',
          },
        ],
      };

      it('should return an array of branches', () => {
        expect(branchAdapter.parseBranches(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayload = {
        branches: [
          {
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Branch 1',
            notes: 'note',
            contact: 'somebody',
          },
          {
            id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
            name: 'Branch 2',
            notes: 'note',
            contact: 'somebody',
          },
        ],
        somethingElse: [],
      };

      it('should return an array of branches', () => {
        expect(branchAdapter.parseBranches(validPayload)).toEqual(validResult);
      });
    });


    describe('when the payload is invalid', () => {
      [
        {
          id: '',
          name: 'Branch',
        },
        { branches: {} },
        {},
        null,
      ].forEach(testCase => {
        it(`Should throw an error on invalid data: ${testCase}`, () => {
          expect(() => {
            branchAdapter.parseBranches(testCase);
          }).toThrow();
        });
      });
    });
  });

  describe('parseBranch', () => {
    const validResult = {
      id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
      name: 'Branch 1',
      notes: 'note',
      contact: 'somebody',
    };

    describe('when the payload is valid', () => {
      const validPayload = {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        name: 'Branch 1',
        notes: 'note',
        contact: 'somebody',
      };

      it('should return a branch object', () => {
        expect(branchAdapter.parseBranch(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayloadWithExtras = {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        name: 'Branch 1',
        notes: 'note',
        contact: 'somebody',
        createdAt: '2016-03-13T08:17:37.037Z',
        updatedAt: '2016-03-13T08:17:37.037Z',
        deletedAt: null,
      };

      it('should return a branch object', () => {
        expect(branchAdapter.parseBranch(validPayloadWithExtras)).toEqual(validResult);
      });
    });

    describe('when the payload is invalid', () => {
      [
        { name: '', id: 'valid' },
        { name: 'valid', id: '' },
        {},
        null,
      ].forEach(testCase => {
        it(`Should throw an error on invalid data: ${testCase}`, () => {
          expect(() => {
            branchAdapter.parseBranch(testCase);
          }).toThrow();
        });
      });
    });
  });
});
