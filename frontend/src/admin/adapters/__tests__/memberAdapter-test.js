import memberAdapter from '../../adapters/memberAdapter.js';

const completePostalAddress = () => (
  {
    address: '303 Collins St',
    suburb: 'Melbourne',
    state: 'Victoria',
    postcode: '3000',
    country: 'Australia',
  }
);

const parsedMemberObjectBase = () => (
  {
    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
    memberName: 'Jo jo',
    memberLastName: 'The 3rd',
    contactNumber: '101010010',
    contactEmail: 'jo@jo.com',
    memberSince: '2016-03-08T22:34:23.721Z',
    additionalInfo: 'Some additional info',
    pastoralNotes: 'Some pastoral notes',
    groups: [{ id: 1, name: 'Group name' }],
    branchId: '1234',
  }
);

const parsedMemberWithPostalAddress = () => {
  const parsedMember = parsedMemberObjectBase();
  parsedMember.postalAddress = completePostalAddress();
  return parsedMember;
};

const parsedMemberWithNullPostalAddress = () => {
  const parsedMember = parsedMemberObjectBase();
  parsedMember.postalAddress = null;
  return parsedMember;
};

export {
  completePostalAddress,
  parsedMemberWithPostalAddress,
  parsedMemberWithNullPostalAddress,
};


describe('member request adapter', () => {
  const payloadMemberObjectBase = () => (
    {
      id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
      firstName: 'Jo jo',
      lastName: 'The 3rd',
      primaryPhoneNumber: '101010010',
      email: 'jo@jo.com',
      memberSince: '2016-03-08T22:34:23.721Z',
      additionalInfo: 'Some additional info',
      pastoralNotes: 'Some pastoral notes',
      groups: [{ id: 1, name: 'Group name' }],
      branchId: '1234',
    }
  );

  const payloadMemberWithPostalAddress = () => {
    const payloadMember = payloadMemberObjectBase();
    payloadMember.postalAddress = completePostalAddress();
    return payloadMember;
  };

  const payloadMemberWithNullPostalAddress = () => {
    const payloadMember = payloadMemberObjectBase();
    payloadMember.postalAddress = null;
    return payloadMember;
  };

  describe('parseMembers', () => {
    const validResult = [parsedMemberWithPostalAddress()];

    describe('when the payload is valid', () => {
      const validPayload = {
        members: [payloadMemberWithPostalAddress()],
      };

      it('should return an array of members', () => {
        expect(memberAdapter.parseMembers(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      const validPayload = {
        members: [payloadMemberWithPostalAddress()],
        somethingElse: [],
      };

      it('should return an array of members', () => {
        expect(memberAdapter.parseMembers(validPayload)).toEqual(validResult);
      });
    });

    describe('when the payload is invalid', () => {
      [
        payloadMemberWithPostalAddress(),
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
    const validResultWithAddress = parsedMemberWithPostalAddress();

    describe('when the payload is valid', () => {
      it('should return a member object', () => {
        const computedResult = memberAdapter.parseMember(payloadMemberWithPostalAddress());
        expect(computedResult).toEqual(validResultWithAddress);
      });
    });

    describe('when the payload is valid, but has additional values', () => {
      it('should return a member object', () => {
        const validPayloadWithExtras = payloadMemberWithPostalAddress();
        validPayloadWithExtras.postalAddress.id = 1;
        validPayloadWithExtras.createdAt = '2016-03-13T08:17:37.037Z';
        validPayloadWithExtras.updatedAt = '2016-03-13T08:17:37.037Z';
        validPayloadWithExtras.deletedAt = null;

        const computedResult = memberAdapter.parseMember(validPayloadWithExtras);
        expect(computedResult).toEqual(validResultWithAddress);
      });
    });

    describe('when postal address is null', () => {
      it('should return a member object with null address', () => {
        const computedResult = memberAdapter.parseMember(payloadMemberWithNullPostalAddress());
        expect(computedResult).toEqual(parsedMemberWithNullPostalAddress());
      });
    });
  });

  describe('prepareNewMemberPayload', () => {
    const fields = {
      branchSelection: 'i',
      contactNumber: 'd',
      contactEmail: 'c',
      memberName: 'a',
      memberLastName: 'b',
      additionalInfo: 'j',
    };

    const expectedPayload = {
      firstName: 'a',
      lastName: 'b',
      email: 'c',
      primaryPhoneNumber: 'd',
      branchId: 'i',
      additionalInfo: 'j',
    };

    it('should convert to the correct fieldnames for the api', () => {
      const result = memberAdapter.prepareNewMemberPayload(fields);
      expect(result).toEqual(expectedPayload);
    });
  });
});
