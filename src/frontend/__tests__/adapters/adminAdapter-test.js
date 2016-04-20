import adminAdapter from '../../adapters/adminAdapter.js';

describe('admin adapter', () => {
  describe('parseAdmins', () => {
    const validResult = [{
      id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
      name: 'Jo jo',
      email: 'The 3rd',
      phoneNumber: 'Jo',
    }];

    describe('when the payload is valid', () => {
      const validPayload = {
        admins: [{
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          name: 'Jo jo',
          email: 'The 3rd',
          phoneNumber: 'Jo',
        }],
      };

      it('should return an array of admins', () => {
        expect(adminAdapter.parseAdmins(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayload = {
        admins: [{
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          name: 'Jo jo',
          email: 'The 3rd',
          phoneNumber: 'Jo',
        }],
        somethingElse: [],
      };

      it('should return an array of admins', () => {
        expect(adminAdapter.parseAdmins(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is invalid', () => {
      [
        {
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          name: 'Jo jo',
          email: 'The 3rd',
          phoneNumber: 'Jo',
        },
        { admins: {} },
        {},
        null,
      ].forEach((testCase) => {
        it(`Should throw an error on invalid data: ${testCase}`, () => {
          expect(() => {
            adminAdapter.parseAdmins(testCase);
          }).toThrow();
        });
      });
    });
  });

  describe('parseAdmin', () => {
    const validResult = {
      id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
      name: 'Jo jo',
      email: 'The 3rd',
      phoneNumber: 'Jo',
    };

    describe('when the payload is valid', () => {
      const validPayload = {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        name: 'Jo jo',
        email: 'The 3rd',
        phoneNumber: 'Jo',
      };

      it('should return a admin object', () => {
        expect(adminAdapter.parseAdminDetails(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayloadWithExtras = {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        name: 'Jo jo',
        email: 'The 3rd',
        phoneNumber: 'Jo',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        memberSince: '2016-03-08T22:34:23.721Z',
      };

      it('should return a admin object', () => {
        expect(adminAdapter.parseAdminDetails(validPayloadWithExtras)).toEqual(validResult);
      });
    });
  });
});
