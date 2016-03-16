'use strict';

import labValidator from '../../../services/labValidator';

describe('labValidator', () => {
    describe('isValid', () => {

      let validLab = {
          'name': 'Valid lab'
      };

      it('should return empty array of errors on valid lab', () => {
          expect(labValidator.isValid(validLab)).toEqual([]);
      });

      it('should return array of errors on null lab', () => {
          expect(labValidator.isValid(null).length).not.toBe(0);
      });

      it('should return array of errors when missing data', () => {
        let invalidLab = {};
        let expectedErrors = ['name'];
        expect(labValidator.isValid(invalidLab)).toEqual(expectedErrors);
      });
    });

    describe('isValidName', () => {
        it('Should return true given an alpha name', () => {
            expect(labValidator.isValidName('aaa')).toBe(true);
        });

        it('Should return true if name is a alphanumeric', () => {
            expect(labValidator.isValidName('Flo the 1st')).toBe(true);
        });

        [
            '',
            null,
            Array(257).join('a'),
            'Flo the 1st<'
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(labValidator.isValidName(testCase)).toBe(false);
            });
        });
    });
});
