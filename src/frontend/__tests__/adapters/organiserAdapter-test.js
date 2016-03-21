'use strict';
import organiserAdapter from '../../adapters/organiserAdapter.js';

describe('organiser adapter', () => {

    describe('parseOrganisers', () => {

        let validResult = [{
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Jo jo',
            email: 'The 3rd',
            phoneNumber: 'Jo'
        }];

        describe('when the payload is valid', () => {
            let validPayload = {
                admins: [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    name: 'Jo jo',
                    email: 'The 3rd',
                    phoneNumber: 'Jo'
                }]
            };

            it('should return an array of organisers', () => {
                expect(organiserAdapter.parseOrganisers(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayload = {
                admins: [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    name: 'Jo jo',
                    email: 'The 3rd',
                    phoneNumber: 'Jo'
                }],
                somethingElse: []
            };

            it('should return an array of organisers', () => {
                expect(organiserAdapter.parseOrganisers(validPayload)).toEqual(validResult);
            });
        });


        describe('when the payload is invalid', () => {
            [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    name: 'Jo jo',
                    email: 'The 3rd',
                    phoneNumber: 'Jo'
                },
                {admins: {}},
                {},
                null
            ].forEach((testCase) => {
                it(`Should throw an error on invalid data: ${testCase}`, () => {
                    expect(() => {organiserAdapter.parseOrganisers(testCase);}).toThrow();
                });
            });
        });
    });

    describe('parseOrganiser', () => {

        let validResult = {
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Jo jo',
            email: 'The 3rd',
            phoneNumber: 'Jo'
        };

        describe('when the payload is valid', () => {

            let validPayload = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                name: 'Jo jo',
                email: 'The 3rd',
                phoneNumber: 'Jo'
            };

            it('should return a organiser object', () => {
                expect(organiserAdapter.parseOrganiserDetails(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayloadWithExtras = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                name: 'Jo jo',
                email: 'The 3rd',
                phoneNumber: 'Jo',
                dateOfBirth: '1990-01-01T00:00:00.000Z',
                memberSince: '2016-03-08T22:34:23.721Z'
            };

            it('should return a organiser object', () => {
                expect(organiserAdapter.parseOrganiserDetails(validPayloadWithExtras)).toEqual(validResult);
            });

        });
    });
});
