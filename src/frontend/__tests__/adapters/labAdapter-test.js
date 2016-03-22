'use strict';
import labAdapter from '../../adapters/labAdapter.js';

describe('lab adapter', () => {

    describe('parseLabs', () => {

        let validResult = [{
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Lab 1',
            notes: 'note',
            contact: 'somebody'

        },
        {
            id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
            name: 'Lab 2',
            notes: 'note',
            contact: 'somebody'
        }];

        describe('when the payload is valid', () => {

            let validPayload = {
                branches: [
                    {
                        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                        name: 'Lab 1',
                        notes: 'note',
                        contact: 'somebody'
                    },
                    {
                        id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                        name: 'Lab 2',
                        notes: 'note',
                        contact: 'somebody'
                    }
                ]
            };

            it('should return an array of labs', () => {
                expect(labAdapter.parseLabs(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayload = {
                branches: [
                    {
                        id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                        name: 'Lab 1',
                        notes: 'note',
                        contact: 'somebody'
                    },
                    {
                        id: 'd35048f7-45e2-8a37-dfb29bbfa81b',
                        name: 'Lab 2',
                        notes: 'note',
                        contact: 'somebody'
                    }
                ],
                somethingElse: []
            };

            it('should return an array of labs', () => {
                expect(labAdapter.parseLabs(validPayload)).toEqual(validResult);
            });
        });


        describe('when the payload is invalid', () => {
            [
                {
                    id: '',
                    name: 'Lab'
                },
                {branches: {}},
                {},
                null
            ].forEach((testCase) => {
                it(`Should throw an error on invalid data: ${testCase}`, () => {
                    expect(() => {labAdapter.parseLabs(testCase);}).toThrow();
                });
            });
        });
    });

    describe('parseLab', () => {

        let validResult = {
            id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
            name: 'Lab 1',
            notes: 'note',
            contact: 'somebody'
        };

        describe('when the payload is valid', () => {

            let validPayload = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                name: 'Lab 1',
                notes: 'note',
                contact: 'somebody'
            };

            it('should return a lab object', () => {
                expect(labAdapter.parseLab(validPayload)).toEqual(validResult);
            });
        });

        describe('when the payload is valid, but has additional values', () => {
            let validPayloadWithExtras = {
                id: 'd35048f7-3f06-45e2-8a37-dfb29bbfa81b',
                name: 'Lab 1',
                notes: 'note',
                contact: 'somebody',
                createdAt: '2016-03-13T08:17:37.037Z',
                updatedAt: '2016-03-13T08:17:37.037Z',
                deletedAt: null
            };

            it('should return a lab object', () => {
                expect(labAdapter.parseLab(validPayloadWithExtras)).toEqual(validResult);
            });

        });

        describe('when the payload is invalid', () => {
            [
                {name:'', id:'valid'},
                {name:'valid', id:''},
                {},
                null
            ].forEach((testCase) => {
                it(`Should throw an error on invalid data: ${testCase}`, () => {
                    expect(() => {labAdapter.parseLab(testCase);}).toThrow();
                });
            });
        });
    });
});
