'use strict';
import organiserValidator from '../../../services/organiserValidator';

describe('organiserValidator', () => {

    describe('isValidWithoutPassword', () => {
        let validOrganiser = {
            'email': 'sherlock@holmes.co.uk',
        };

        let validOrganiserWithOptional = {
            'name': 'Sherlock',
            'email': 'sherlock@holmes.co.uk',
            'phoneNumber': '0396291146',
        };

        it('should return empty array of errors on valid organiser', () => {
            expect(organiserValidator.isValidWithoutPassword(validOrganiser)).toEqual([]);
        });

        it('should return empty array of errors on valid organiser with optional fields', () => {
            expect(organiserValidator.isValidWithoutPassword(validOrganiserWithOptional)).toEqual([]);
        });

        it('should return array of errors on null organiser', () => {
            expect(organiserValidator.isValidWithoutPassword(null).length).not.toBe(0);
        });

        it('should return array of errors when missing data', () => {
            let invalidOrganiser = {
                'email': ''
            };
            let expectedErrors = ['email'];
            expect(organiserValidator.isValidWithoutPassword(invalidOrganiser)).toEqual(expectedErrors);
        });
    });

    describe('isValid', () => {

        let validOrganiser = {
            'email': 'sherlock@holmes.co.uk',
            'password': 'This is a valid password'
        };

        let validOrganiserWithOptional = {
            'name': 'Sherlock',
            'email': 'sherlock@holmes.co.uk',
            'phoneNumber': '0396291146',
            'password': 'This is a valid password'
        };

        it('should return empty array of errors on valid organiser', () => {
            expect(organiserValidator.isValid(validOrganiser)).toEqual([]);
        });

        it('should return empty array of errors on valid organiser with optional fields', () => {
            expect(organiserValidator.isValid(validOrganiserWithOptional)).toEqual([]);
        });

        it('should return array of errors on null organiser', () => {
            expect(organiserValidator.isValid(null).length).not.toBe(0);
        });

        it('should return array of errors when missing data', () => {
            let invalidOrganiser = {
                'email': '',
                'password': ''
            };
            let expectedErrors = ['email', 'password'];
            expect(organiserValidator.isValid(invalidOrganiser)).toEqual(expectedErrors);
        });
    });

});
