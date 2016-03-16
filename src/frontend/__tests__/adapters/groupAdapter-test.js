'use strict';
import groupAdapter from '../../adapters/groupAdapter.js';

describe('group adapter', () => {

    describe('parseGroups', () => {

        let validResult = [{
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Tuesday',
            description: 'Hi'
        },
        {
            id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
            name: 'Wednesday',
            description: 'Hi'
        }];

        describe('when the payload is valid', () => {

            let validPayload = {
                groups: [
                    {
                        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                        name: 'Tuesday',
                        description: 'Hi'
                    },
                    {
                        id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                        name: 'Wednesday',
                        description: 'Hi'
                    }
                ]
            };

            it('should return an array of groups', () => {
                expect(groupAdapter.parseGroups(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayload = {
                groups: [
                    {
                        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                        name: 'Tuesday',
                        description: 'Hi'
                    },
                    {
                        id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                        name: 'Wednesday',
                        description: 'Hi'
                    }
                ],
                somethingElse: []
            };

            it('should return an array of groups', () => {
                expect(groupAdapter.parseGroups(validPayload)).toEqual(validResult);
            });
        });


        describe('when the payload is invalid', () => {
            [
                {
                    id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                    name: 'Tuesday',
                    description: 'Hi'
                },
                {groups: {}},
                {},
                null
            ].forEach((testCase) => {
                it(`Should throw an error on invalid data: ${testCase}`, () => {
                    expect(() => {groupAdapter.parseGroups(testCase);}).toThrow();
                });
            });
        });
    });

    describe('parseGroup', () => {

        let validResult = {
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Tuesday',
            description: 'Hi'
        };

        describe('when the payload is valid', () => {

            let validPayload = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                name: 'Tuesday',
                description: 'Hi'
            };

            it('should return a group object', () => {
                expect(groupAdapter.parseGroup(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayloadWithExtras = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                name: 'Tuesday',
                description: 'Hi',
                createdAt: '2016-03-13T08:17:37.037Z',
                updatedAt: '2016-03-13T08:17:37.037Z',
                deletedAt: null
            };

            it('should return a group object', () => {
                expect(groupAdapter.parseGroup(validPayloadWithExtras)).toEqual(validResult);
            });

        });

        describe('when the payload is invalid', () => {
            [
                {name:'', description:'valid', id:'valid'},
                {name:'valid', description:'', id:'valid'},
                {name:'valid', description:'valid', id:''},
                {},
                null
            ].forEach((testCase) => {
                it(`Should throw an error on invalid data: ${testCase}`, () => {
                    expect(() => {groupAdapter.parseGroup(testCase);}).toThrow();
                });
            });
        });
    });
});
