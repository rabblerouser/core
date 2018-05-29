'use strict';

// Prevents warnings from Chai's `expect()….to.be.true` and similar
/* eslint no-unused-expressions: "off" */

const inputValidator = require('../../../src/lib/inputValidator');

describe('inputValidator', () => {
  describe('isValidName', () => {
    it('Should return true given an alpha name', () => {
      expect(inputValidator.isValidName('aaa')).to.be.true;
    });

    it('Should return true if name is a alphanumeric', () => {
      expect(inputValidator.isValidName('Flo the 1st')).to.be.true;
    });

    [
      undefined,
      '',
      null,
      'a'.repeat(256),
      'Flo the 1st<',
    ].forEach(testCase => {
      it(`Should return false if name is ${testCase}`, () => {
        expect(inputValidator.isValidName(testCase)).to.be.false;
      });
    });
  });

  describe('isValidEmail', () => {
    it('Should return true given a string with an \'@\' and a \'.\'', () => {
      expect(inputValidator.isValidEmail('aaa@attt.com')).to.be.true;
    });
  });

  describe('isValidPassword', () => {
    [
      'I am a long password',
      '1 w1ll b3 4gott3n',
      '12345678910',
    ].forEach(testCase => {
      it(`Should return true given a password ${testCase}`, () => {
        expect(inputValidator.isValidPassword(testCase)).to.be.true;
      });
    });

    [
      'toolittle',
      'a'.repeat(201),
      undefined,
      null,
    ].forEach(testCase => {
      it(`Should return false given password is ${testCase}`, () => {
        expect(inputValidator.isValidPassword(testCase)).to.be.false;
      });
    });
  });

  describe('isValidPhoneNumber', () => {
    [
      '+61472817381',
      '0328171381',
      '0428171331',
      '04-2817-133-1',
      '04 2817 1331',
      '+1555-555-5555',
      '+1(555)555-5555',
      '+65 2345 7908',
      '+18-1111-1111111',
    ].forEach(testCase => {
      it(`Should return true given a string with a mobile phone number ${testCase}`, () => {
        expect(inputValidator.isValidPhone(testCase)).to.be.true;
      });
    });

    [
      '',
      '-;',
      ' 0 0 1;',
      null,
      'words?',
    ].forEach(testCase => {
      it(`Should return false if phone is ${testCase}`, () => {
        expect(inputValidator.isValidPhone(testCase)).to.be.false;
      });
    });
  });


  describe('isValidOptionalName', () => {
    const validTestCases = [
      null,
      '',
      undefined,
      'A valid name',
    ];

    validTestCases.forEach(input => {
      it(`should return true if given a ${input} value`, () => {
        expect(inputValidator.isValidOptionalName(input)).to.be.true;
      });
    });

    const testCases = [
      'a'.repeat(256),
      'Flo the 1st<',
    ];

    testCases.forEach(input => {
      it(`should return false if given a ${input} value`, () => {
        expect(inputValidator.isValidOptionalName(input)).to.be.false;
      });
    });
  });

  describe('isValidText', () => {
    const validTestCases = [
      'A valid text block',
      'Flo the 1st<',
      'a'.repeat(255),
    ];

    validTestCases.forEach(input => {
      it(`should return true if given a ${input} value`, () => {
        expect(inputValidator.isValidText(input)).to.be.true;
      });
    });

    const testCases = [
      null,
      '',
      undefined,
      'a'.repeat(256),
    ];

    testCases.forEach(input => {
      it(`should return false if given a ${input} value`, () => {
        expect(inputValidator.isValidText(input)).to.be.false;
      });
    });
  });

  describe('isValidOptionalTextBlock', () => {
    const validTestCases = [
      null,
      '',
      undefined,
      'A valid text block',
      'Flo the 1st<',
      'a'.repeat(99999),
    ];

    validTestCases.forEach(input => {
      it(`should return true if given a ${input} value`, () => {
        expect(inputValidator.isValidOptionalTextBlock(input)).to.be.true;
      });
    });

    const testCases = [
      'a'.repeat(100000),
    ];

    testCases.forEach(input => {
      it(`should return false if given a ${input} value`, () => {
        expect(inputValidator.isValidOptionalTextBlock(input)).to.be.false;
      });
    });
  });

  describe('isValidTextBlock', () => {
    it('Should be valid if it is a big string', () => {
      expect(inputValidator.isValidTextBlock('a'.repeat(99999))).to.be.true;
    });

    [
      '',
      'a'.repeat(100000),
      null,
      undefined,
    ].forEach(testCase => {
      it('Should return false if the block is invalid', () => {
        expect(inputValidator.isValidTextBlock(testCase)).to.be.false;
      });
    });
  });


  describe('isValidUUID', () => {
    it('should return true for V4 uuids', () => {
      expect(inputValidator.isValidUUID('5d773d92-47fb-4ad5-90c0-72c1b6e4af3a')).to.be.true;
    });

    it('should return false for non V4 uuids', () => {
      expect(inputValidator.isValidUUID('4df38c00-e65a-11e5-a8bf-ed9212c0336b')).to.be.false;
    });


    const testCases = [
      'a'.repeat(20),
      null,
      undefined,
      1,
    ];

    testCases.forEach(input => {
      it(`should return false if given a ${input} value`, () => {
        expect(inputValidator.isValidUUID(input)).to.be.false;
      });
    });
  });
});
