'use strict';

require("../support/specHelper");

const moment = require("moment");

var models = require("../../models"),
    Address = models.Address,
    Member = models.Member;

describe("Member", () => {
    it("persists in the database when created", (done) => {
        Address.create({
            address: "123 fake st",
            country: "Australia",
            suburb: "Geelong",
            state: "Victoria",
            postcode: 1234
        }).then((address) => {
            Member.create({
                email: "test@test.com",
                firstName: "Dark",
                lastName: "Knight",
                phoneNumber: "1234567890",
                dateOfBirth: "2011-12-13",
                residentialAddress: address.dataValues.id,
                postalAddress: address.dataValues.id
            }).then((_) => {
                Member.findAll().then( (members) => {
                    expect(members.length).toBe(1);

                    var memberDataValues = members[0].dataValues;
                    expect(memberDataValues.firstName).toBe("Dark");
                    expect(memberDataValues.lastName).toBe("Knight");
                    expect(memberDataValues.email).toBe("test@test.com");
                    expect(memberDataValues.phoneNumber).toBe("1234567890");
                    expect(moment(memberDataValues.dateOfBirth).format("YYYY-MM-DD")).toBe("2011-12-13");

                    done();
                });
            });
        });
    });
});
