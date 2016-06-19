import memberAdapter from '../../adapters/memberAdapter.js';

describe('member request adapter', () => {
  describe('parseMembers', () => {
    const validResult = [{
      id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
      memberName: 'Jo jo',
      memberLastName: 'The 3rd',
      contactName: 'Jo',
      contactLastName: 'The 2nd',
      contactNumber: '101010010',
      contactEmail: 'jo@jo.com',
      memberBirthYear: '1990',
      memberSince: '2016-03-08T22:34:23.721Z',
      additionalInfo: 'Some additional info',
      pastoralNotes: 'Some pastoral notes',
      groups: [{ id: 1, name: 'Group name' }],
      branchId: '1234',
    }];

    describe('when the payload is valid', () => {
      const validPayload = {
        members: [{
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          firstName: 'Jo jo',
          lastName: 'The 3rd',
          contactFirstName: 'Jo',
          contactLastName: 'The 2nd',
          primaryPhoneNumber: '101010010',
          email: 'jo@jo.com',
          dateOfBirth: '1990',
          memberSince: '2016-03-08T22:34:23.721Z',
          additionalInfo: 'Some additional info',
          pastoralNotes: 'Some pastoral notes',
          groups: [{ id: 1, name: 'Group name' }],
          branchId: '1234',
        }],
      };

      it('should return an array of members', () => {
        expect(memberAdapter.parseMembers(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayload = {
        members: [{
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          firstName: 'Jo jo',
          lastName: 'The 3rd',
          contactFirstName: 'Jo',
          contactLastName: 'The 2nd',
          primaryPhoneNumber: '101010010',
          email: 'jo@jo.com',
          dateOfBirth: '1990',
          memberSince: '2016-03-08T22:34:23.721Z',
          additionalInfo: 'Some additional info',
          pastoralNotes: 'Some pastoral notes',
          groups: [{ id: 1, name: 'Group name' }],
          branchId: '1234',
        }],
        somethingElse: [],
      };

      it('should return an array of members', () => {
        expect(memberAdapter.parseMembers(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is invalid', () => {
      [
        {
          id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
          firstName: 'Jo jo',
          lastName: 'The 3rd',
          contactFirstName: 'Jo',
          contactLastName: 'The 2nd',
          primaryPhoneNumber: '101010010',
          email: 'jo@jo.com',
          dateOfBirth: '1990',
          memberSince: '2016-03-08T22:34:23.721Z',
          additionalInfo: 'Some additional info',
          groups: [{ id: 1, name: 'Group name' }],
          branchId: '1234',
        },
        { members: {} },
        {},
        null,
      ].forEach(testCase => {
        it(`Should throw an error on invalid data: ${testCase}`, () => {
          expect(() => {
            memberAdapter.parseMembers(testCase);
          }).toThrow();
        });
      });
    });
  });

  describe('parseMember', () => {
    const validResult = {
      id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
      memberName: 'Jo jo',
      memberLastName: 'The 3rd',
      contactName: 'Jo',
      contactLastName: 'The 2nd',
      contactNumber: '101010010',
      contactEmail: 'jo@jo.com',
      memberBirthYear: '1990',
      memberSince: '2016-03-08T22:34:23.721Z',
      additionalInfo: 'Some additional info',
      pastoralNotes: 'Some pastoral notes',
      groups: [{ id: 1, name: 'Group name' }],
      branchId: '1234',
    };

    describe('when the payload is valid', () => {
      const validPayload = {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        firstName: 'Jo jo',
        lastName: 'The 3rd',
        contactFirstName: 'Jo',
        contactLastName: 'The 2nd',
        primaryPhoneNumber: '101010010',
        email: 'jo@jo.com',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        memberSince: '2016-03-08T22:34:23.721Z',
        additionalInfo: 'Some additional info',
        pastoralNotes: 'Some pastoral notes',
        groups: [{ id: 1, name: 'Group name' }],
        branchId: '1234',
      };

      it('should return a member object', () => {
        expect(memberAdapter.parseMember(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayloadWithExtras = {
        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
        firstName: 'Jo jo',
        lastName: 'The 3rd',
        contactFirstName: 'Jo',
        contactLastName: 'The 2nd',
        primaryPhoneNumber: '101010010',
        email: 'jo@jo.com',
        dateOfBirth: '1990-01-01T00:00:00.000Z',
        memberSince: '2016-03-08T22:34:23.721Z',
        additionalInfo: 'Some additional info',
        pastoralNotes: 'Some pastoral notes',
        groups: [{ id: 1, name: 'Group name' }],
        branchId: '1234',
        createdAt: '2016-03-13T08:17:37.037Z',
        updatedAt: '2016-03-13T08:17:37.037Z',
        deletedAt: null,
      };

      it('should return a member object', () => {
        expect(memberAdapter.parseMember(validPayloadWithExtras)).toEqual(validResult);
      });
    });
  });

  describe('prepareNewMemberPayload', () => {
    const fields = {
      branchSelection: 'i',
      contactName: 'g',
      contactLastName: 'h',
      contactNumber: 'd',
      contactEmail: 'c',
      memberName: 'a',
      memberLastName: 'b',
      memberBirthYear: '2000',
      additionalInfo: 'j',
    };

    const expectedPayload = {
      firstName: 'a',
      lastName: 'b',
      email: 'c',
      primaryPhoneNumber: 'd',
      dateOfBirth: '01/01/2000',
      contactFirstName: 'g',
      contactLastName: 'h',
      branchId: 'i',
      additionalInfo: 'j',
    };

    it('should convert to the correct fieldnames for the api', () => {
      const result = memberAdapter.prepareNewMemberPayload(fields);
      expect(result).toEqual(expectedPayload);
    });
  });
});
