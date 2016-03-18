'use strict';
import participantAdapter from '../../adapters/participantAdapter.js';

describe('participant adapter', () => {

    describe('parseParticipants', () => {

        let validResult = [{
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            participantName: 'Jo jo',
            participantLastName: 'The 3rd',
            contactName: 'Jo',
            contactLastName: 'The 2nd',
            contactNumber: '101010010',
            contactEmail: 'jo@jo.com',
            participantBirthYear: '1990',
            schoolType: 'Primary',
            memberSince: '2016-03-08T22:34:23.721Z',
            additionalInfo: 'Some additional info',
            groups: [{id: 1, name: 'Group name'}],
            labId: '1234'
        }];

        describe('when the payload is valid', () => {
            let validPayload = {
                members: [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    firstName: 'Jo jo',
                    lastName: 'The 3rd',
                    contactFirstName: 'Jo',
                    contactLastName: 'The 2nd',
                    primaryPhoneNumber: '101010010',
                    email: 'jo@jo.com',
                    dateOfBirth: '1990',
                    schoolType: 'Primary',
                    memberSince: '2016-03-08T22:34:23.721Z',
                    additionalInfo: 'Some additional info',
                    groups: [{id: 1, name: 'Group name'}],
                    branchId:'1234'
                }]
            };

            it('should return an array of participants', () => {
                expect(participantAdapter.parseParticipants(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayload = {
                members: [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    firstName: 'Jo jo',
                    lastName: 'The 3rd',
                    contactFirstName: 'Jo',
                    contactLastName: 'The 2nd',
                    primaryPhoneNumber: '101010010',
                    email: 'jo@jo.com',
                    dateOfBirth: '1990',
                    schoolType: 'Primary',
                    memberSince: '2016-03-08T22:34:23.721Z',
                    additionalInfo: 'Some additional info',
                    groups: [{id: 1, name: 'Group name'}],
                    branchId:'1234'
                }],
                somethingElse: []
            };


            it('should return an array of participants', () => {
                expect(participantAdapter.parseParticipants(validPayload)).toEqual(validResult);
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
                    schoolType: 'Primary',
                    memberSince: '2016-03-08T22:34:23.721Z',
                    additionalInfo: 'Some additional info',
                    groups: [{id: 1, name: 'Group name'}],
                    branchId:'1234'
                },
                {participants: {}},
                {},
                null
            ].forEach((testCase) => {
                it(`Should throw an error on invalid data: ${testCase}`, () => {
                    expect(() => {participantAdapter.parseParticipants(testCase);}).toThrow();
                });
            });
        });
    });

    describe('parseParticipant', () => {

        let validResult = {
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            participantName: 'Jo jo',
            participantLastName: 'The 3rd',
            contactName: 'Jo',
            contactLastName: 'The 2nd',
            contactNumber: '101010010',
            contactEmail: 'jo@jo.com',
            participantBirthYear: '1990',
            schoolType: 'Primary',
            memberSince: '2016-03-08T22:34:23.721Z',
            additionalInfo: 'Some additional info',
            groups: [{id: 1, name: 'Group name'}],
            labId: '1234'
        };

        describe('when the payload is valid', () => {

            let validPayload = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                firstName: 'Jo jo',
                lastName: 'The 3rd',
                contactFirstName: 'Jo',
                contactLastName: 'The 2nd',
                primaryPhoneNumber: '101010010',
                email: 'jo@jo.com',
                dateOfBirth: '1990-01-01T00:00:00.000Z',
                schoolType: 'Primary',
                memberSince: '2016-03-08T22:34:23.721Z',
                additionalInfo: 'Some additional info',
                groups: [{id: 1, name: 'Group name'}],
                branchId:'1234'
            };

            it('should return a participant object', () => {
                expect(participantAdapter.parseParticipant(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayloadWithExtras = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                firstName: 'Jo jo',
                lastName: 'The 3rd',
                contactFirstName: 'Jo',
                contactLastName: 'The 2nd',
                primaryPhoneNumber: '101010010',
                email: 'jo@jo.com',
                dateOfBirth: '1990-01-01T00:00:00.000Z',
                schoolType: 'Primary',
                memberSince: '2016-03-08T22:34:23.721Z',
                additionalInfo: 'Some additional info',
                groups: [{id: 1, name: 'Group name'}],
                branchId:'1234',
                createdAt: '2016-03-13T08:17:37.037Z',
                updatedAt: '2016-03-13T08:17:37.037Z',
                deletedAt: null
            };

            it('should return a participant object', () => {
                expect(participantAdapter.parseParticipant(validPayloadWithExtras)).toEqual(validResult);
            });

        });
    });
});
