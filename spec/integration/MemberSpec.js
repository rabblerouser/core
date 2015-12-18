'use strict';
var models = require("../../models"),
  Address = models.Address,
  Member = models.Member;


describe("Member", () => {
  beforeEach((done) => {
    Address.truncate({cascade: true}).then(() => {
      Member.truncate({cascade: true}).nodeify(done);
    });
  });

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
        dateOfBirth: Date.parse("13 December, 2011"),
        residentialAddress: address.dataValues.id,
        postalAddress: address.dataValues.id
      }).then((_) => {
        Member.findAll().then( (members) => {
          expect(members.length).toBe(1);

          var memberDataValues = members[0].dataValues;
          expect(memberDataValues.firstName).toBe("Dark");
          expect(memberDataValues.lastName).toBe("Knight");
          expect(memberDataValues.email).toBe("test@test.com");

          done();
        });
      });
    });
  });
})
;