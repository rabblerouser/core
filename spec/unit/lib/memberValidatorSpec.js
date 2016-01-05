'use strict';

const moment = require("moment");

var _  = require("lodash");
require("../../support/specHelper");

var memberValidator = require("../../../lib/memberValidator");

describe("memberValidator", () => {
    describe("isValid", () => {
        let validMember = {
                "firstName": "Sherlock",
                "lastName": "Holmes",
                "gender": "horse radish",
                "email": `sherlock@holmes.co.uk`,
                "dateOfBirth": "22/12/1900",
                "primaryPhoneNumber": "0396291146",
                "secondaryPhoneNumber": "0396291146",
                "residentialAddress": {
                    "address": "222b Baker St",
                    "suburb": "London",
                    "country": "England",
                    "state": "VIC",
                    "postcode": "1234"
                },
                "postalAddress": {
                    "address": "303 collins st",
                    "suburb": "melbourne",
                    "country": "australia",
                    "state": "VIC",
                    "postcode": "3000"
                }
        };

        let optionalFields = ["secondaryPhoneNumber", "gender"];
        let validMemberWithoutOptionalFields =  _.omit(validMember, optionalFields);

        it("should return empty array of errors on valid member", () => {
            expect(memberValidator.isValid(validMember)).toEqual([]);
        });

        it("should return empty array of errors on valid member without optional fields", () => {
            expect(memberValidator.isValid(validMemberWithoutOptionalFields)).toEqual([]);
        });

        _.keys(validMemberWithoutOptionalFields).forEach((key) => {
            it("should return array with error " + key + " on member missing a " + key, () => {
                expect(memberValidator.isValid(_.omit(validMember, key))).toEqual([key]);
            });
        });

        it("should return array of errors on null member", () => {
            expect(memberValidator.isValid(null).length).not.toBe(0);
        });
    });

    describe("isValidName", () => {
        it("Should return true given an alpha name", () => {
            expect(memberValidator.isValidName("aaa")).toBe(true);
        });

        it("Should return true if name is a alphanumeric", () => {
            expect(memberValidator.isValidName("Flo the 1st")).toBe(true);
        });

        [
            "",
            null,
            "a".repeat(256),
            "Flo the 1st<"
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(memberValidator.isValidName(testCase)).toBe(false);
            });
        });
    });

    describe("isValidGender", () => {
        [
            "aaa",
            "Flo the 1st",
            "",
            null
        ].forEach((testCase) => {
            it(`Should return true if name is ${testCase}`, () => {
                expect(memberValidator.isValidGender(testCase)).toBe(true);
            });
        });

        [
            "a".repeat(256),
            "Flo the 1st<"
        ].forEach((testCase) => {
            it(`Should return false if name is ${testCase}`, () => {
                expect(memberValidator.isValidGender(testCase)).toBe(false);
            });
        });
    });

    describe("isValidEmail", () => {
        it("Should return true given a string with an '@' and a '.'", () => {
            expect(memberValidator.isValidEmail("aaa@attt.com")).toBe(true);
        });
    });

    describe("isValidPrimaryPhoneNumber", () => {
        [
            "+61472817381",
            "0328171381"
        ].forEach((testCase) => {
            it(`Should return true given a string with a mobile phone number ${testCase}`, () => {
                expect(memberValidator.isValidPhone(testCase)).toBe(true);
            });
        });

        [
            "",
            null,
            "04"+"1".repeat(9),
            "+61"+"4".repeat(10)
        ].forEach((testCase) => {
            it(`Should return false if phone is ${testCase}`, () => {
                expect(memberValidator.isValidPhone(testCase)).toBe(false);
            });
        });
    });

    describe("isValidSecondaryPhoneNumber", () => {
        [
            "+61472817381",
            "0328171381",
            "",
            null
        ].forEach((testCase) => {
            it(`Should return true given a string with a mobile phone number ${testCase}`, () => {
                expect(memberValidator.isValidOptionalPhone(testCase)).toBe(true);
            });
        });

        [
            "04"+"1".repeat(9),
            "+61"+"4".repeat(10)
        ].forEach((testCase) => {
            it(`Should return false if phone is ${testCase}`, () => {
                expect(memberValidator.isValidOptionalPhone(testCase)).toBe(false);
            });
        });
    });

    describe("isValidDateOfBirth", () => {
        it("Should return true given a string with a dateOfBirth", () => {
            expect(memberValidator.isValidDate("22/12/1900")).toBe(true);
        });

        let testCases = [
            null,
            "",
            "21 Dec 2015",
            moment().add(7, 'days'),
            "222/12/1900"
        ];

        testCases.forEach((input) => {
            it(`Should return false given a ${input} dateOfBirth`, () => {
                expect(memberValidator.isValidDate(input)).toBe(false);
            });
        });
    });

    describe("isValidAddress",() => {
        let validAddress = {};

        beforeEach(() => {
            validAddress = {
                address: "221b Baker St",
                suburb: "London",
                country: "England",
                state: "VIC",
                postcode: "1234"
            }
        });

        [
            {address: null},
            {address: ""},
            {address: "a".repeat(256)},

            {suburb: null},
            {suburb: ""},
            {suburb: "a".repeat(256)},

            {state: null},
            {state: ""},
            {state: "a".repeat(4)},

            {postcode: null},
            {postcode: ""},
            {postcode: "abdt"},
            {postcode: "-123"},
            {postcode: "1".repeat(5)},

            {country: null},
            {country: ""},
            {country: "a".repeat(256)}
        ].forEach((failingTestScenario) => {
            it("Should return false if given " + JSON.stringify(failingTestScenario), () => {
                expect(memberValidator.isValidAddress(
                    _.merge(validAddress, failingTestScenario))).toBe(false);
            });
        });

        it("Should return true given an address object'", () => {
            expect(memberValidator.isValidAddress(validAddress)).toBe(true);
        });

        it("Should return true given an address object with postcode as int'", () => {
            validAddress.postcode = 1234;
            expect(memberValidator.isValidAddress(validAddress)).toBe(true);
        });

        it("Should return false if address is null", () => {
            expect(memberValidator.isValidAddress(null)).toBe(false);
        });

        it("Should return false given an address with no state'", () => {
            validAddress.state = null;
            expect(memberValidator.isValidAddress(validAddress)).toBe(false);
        });
    });
});