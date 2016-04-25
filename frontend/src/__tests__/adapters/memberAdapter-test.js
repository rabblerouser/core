import memberAdapter from '../../adapters/memberAdapter.js';

describe('member request adapter', () => {
  describe('prepareNewMemberPayload', () => {
    const fields = {
      labSelection: 'i',
      contactName: 'g',
      contactLastName: 'h',
      contactNumber: 'd',
      contactEmail: 'c',
      participantName: 'a',
      participantLastName: 'b',
      participantBirthYear: '2000',
      schoolType: 'Other',
      schoolTypeOtherText: 'home',
      additionalInfo: 'j',
    };

    const expectedPayload = {
      firstName: 'a',
      lastName: 'b',
      email: 'c',
      primaryPhoneNumber: 'd',
      dateOfBirth: '01/01/2000',
      schoolType: 'home',
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
