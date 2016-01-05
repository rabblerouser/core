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
                "email": `sherlock@holmes.co.uk`,
                "dateOfBirth": "22/12/1900",
                "phoneNumber": "0396291146",
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

        it("should return true on valid member", () => {
            expect(memberValidator.isValid(validMember)).toBe(true);
        });

        _.keys(validMember).forEach((key) => {
            it("should return false on member missing a " + key, () => {
                expect(memberValidator.isValid(_.omit(validMember, key))).toBe(false);
            });
        });
    });

    describe("isValidName", () => {
        it("Should return true given an alpha name", () => {
            expect(memberValidator.isValidName("aaa")).toBe(true);
        });

        it("Should return true if name is a alphanumeric", () => {
            expect(memberValidator.isValidName("Flo the 1st")).toBe(true);
        });

        it("Should return false if name is empty string", () => {
            expect(memberValidator.isValidName("")).toBe(false);
        });

        it("Should return false if name is null", () => {
            expect(memberValidator.isValidName(null)).toBe(false);
        });

        it("Should return false if name is more than 255 characters", () => {
            expect(memberValidator.isValidName("a".repeat(256))).toBe(false);
        });

        it("Should return false if name contains special characters", () => {
            expect(memberValidator.isValidName("Flo the 1st<")).toBe(false);
        });
    });

    describe("isValidEmail", () => {
        it("Should return true given a string with an '@' and a '.'", () => {
            expect(memberValidator.isValidEmail("aaa@attt.com")).toBe(true);
        });
    });

    describe("isValidPhoneNumber", () => {
        it("Should return true given a string with a mobile phone number'", () => {
            expect(memberValidator.isValidPhone("+61472817381")).toBe(true);
        });

        it("Should return true given a string with a home phone number'", () => {
            expect(memberValidator.isValidPhone("0328171381")).toBe(true);
        });

        it("Should return false if phone is empty string", () => {
            expect(memberValidator.isValidPhone("")).toBe(false);
        });

        it("Should return false if phone is null", () => {
            expect(memberValidator.isValidPhone(null)).toBe(false);
        });

        it("Should return false if phone is more than 10 characters", () => {
            expect(memberValidator.isValidPhone("04"+"1".repeat(9))).toBe(false);
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