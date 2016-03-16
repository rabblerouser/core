'use strict';

import groupValidator from '../../../services/groupValidator';

describe('groupValidator', () => {
    describe('isValid', () => {

      let validGroup = {
          'name': 'Valid group',
          'description': 'some description'
      };

      it('should return empty array of errors on valid group', () => {
          expect(groupValidator.isValid(validGroup)).toEqual([]);
      });

      it('should return array of errors on null group', () => {
          expect(groupValidator.isValid(null).length).not.toBe(0);
      });

      it('should return array of errors when missing data', () => {
        let invalidGroup = {};
        let expectedErrors = ['name','description'];
        expect(groupValidator.isValid(invalidGroup)).toEqual(expectedErrors);
      });

    });

    describe('isValidName', () => {
        it('Should return true given an alpha name', () => {
            expect(groupValidator.isValidName('aaa')).toBe(true);
        });

        it('Should return true if name is a alphanumeric', () => {
            expect(groupValidator.isValidName('Flo the 1st')).toBe(true);
        });

        [
            '',
            null,
            Array(257).join('a'),
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(groupValidator.isValidName(testCase)).toBe(false);
            });
        });
    });

    describe('isValidDescription', () => {
      it('Should be valid if it is a big string', () => {
        expect(groupValidator.isValidDescription(Array(2000).join('a'))).toBe(true);
      });

      [
          '',
          null,
          undefined
      ].forEach((testCase) => {
          it(`Should return false if name is ${testCase}`, () => {
              expect(groupValidator.isValidDescription(testCase)).toBe(false);
          });
      });

    });
});
