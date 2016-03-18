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
});
