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
                    "postcode": ".-0123string"
                },
                "postalAddress": {
                    "address": "303 collins st",
                    "suburb": "melbourne",
                    "country": "Australia",
                    "state": "VIC",
                    "postcode": "3000"
                },
                membershipType: "full"
        };

        let optionalFields = ["secondaryPhoneNumber", "gender"];
        let validMemberWithoutOptionalFields =  _.omit(validMember, optionalFields);

        it("should return empty array of errors on valid member", () => {
            expect(memberValidator.isValid(validMember)).toEqual([]);
        });

        it("should return empty array of errors on valid member without optional fields", () => {
            expect(memberValidator.isValid(validMemberWithoutOptionalFields)).toEqual([]);
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
            "0328171381",
            "0428171331",
            "04-2817-133-1",
            "04 2817 1331",
            "+1555-555-5555",
            "+1(555)555-5555",
            "+65 2345 7908",
            "+18-1111-1111111"
        ].forEach((testCase) => {
            it(`Should return true given a string with a mobile phone number ${testCase}`, () => {
                expect(memberValidator.isValidPhone(testCase)).toBe(true);
            });
        });

        [
            "",
            null,
            "words?"
        ].forEach((testCase) => {
            it(`Should return false if phone is ${testCase}`, () => {
                expect(memberValidator.isValidPhone(testCase)).toBe(false);
            });
        });
    });

    describe("isValidDateOfBirth", () => {
        it("Should return true given a string with a dateOfBirth", () => {
            expect(memberValidator.isValidDate("22/12/1900")).toBe(true);
        });

        it("Should return true if the user is 16 years old", () => {
            let date = moment().subtract(16, 'years').format('DD/MM/YYYY');
            expect(memberValidator.isValidDate(date)).toBe(true);
        });

        it("Should return false if the user is under 16 years old", () => {
            let date = moment().subtract(16, 'years').add(1, 'days').format('L');
            expect(memberValidator.isValidDate(date)).toBe(false);
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
                country: "Australia",
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

            {country: null},
            {country: ""},
            {country: "a".repeat(256)},
            {country: "Select Country"}
        ].forEach((failingTestScenario) => {
            it("Should return false if given " + JSON.stringify(failingTestScenario), () => {
                expect(memberValidator.isValidAddress(
                    _.merge(validAddress, failingTestScenario)).length).not.toBe(0);
            });
        });

        it("Should return empty array given an address object'", () => {
            expect(memberValidator.isValidAddress(validAddress).length).toBe(0);
        });

        it("Should return empty array given an address object with postcode as int for Australian address", () => {
            validAddress.postcode = 1234;
            expect(memberValidator.isValidAddress(validAddress).length).toBe(0);
        });

        it("Should return empty array given an address object with postcode as int for international address", () => {
            validAddress.country = "England";
            validAddress.postcode = 12345678;
            expect(memberValidator.isValidAddress(validAddress).length).toBe(0);
        });

        it("Should return array of errors if address is null", () => {
            expect(memberValidator.isValidAddress(null).length).not.toBe(0);
        });

        it("Should return array with 1 error given an address with no state'", () => {
            validAddress.state = null;
            expect(memberValidator.isValidAddress(validAddress).length).toBe(1);
        });

        [
            null,
            "",
            "-123",
            "abdt",
            "1".repeat(5),
        ].forEach((failingTestScenario) => {
            it("For Australia Address, Should return false if given postcode:" + failingTestScenario, ()=> {
                validAddress.postcode = failingTestScenario;
                expect(memberValidator.isValidAddress(validAddress).length).not.toBe(0);
            });
        });

        [
            null,
            "",
            "1".repeat(17),
        ].forEach((failingTestScenario) => {
            it("For International Address, Should return false if given postcode:" + failingTestScenario, ()=> {
                validAddress.country = "England";
                validAddress.postcode = failingTestScenario;
                expect(memberValidator.isValidAddress(validAddress).length).not.toBe(0);
            });
        });
    });

    describe("isValidMembershipType", () => {
        it("Should return true if type is full", () => {
            expect(memberValidator.isValidMembershipType("full")).toBe(true);
        });

        it("Should return true if type is permanentResident", () => {
            expect(memberValidator.isValidMembershipType("permanentResident")).toBe(true);
        });

        it("Should return true if type is full", () => {
            expect(memberValidator.isValidMembershipType("supporter")).toBe(true);
        });

        it("Should return true if type is full", () => {
            expect(memberValidator.isValidMembershipType("internationalSupporter")).toBe(true);
        });

        [
            "",
            null,
            "a".repeat(256),
            "Flo the 1st<",
            "fulla"
        ].forEach((testCase) => {
            it(`Should return false if type is ${testCase}`, () => {
                expect(memberValidator.isValidMembershipType(testCase)).toBe(false);
            });
        });
    });
});
