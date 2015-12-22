'use strict';

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      sinon = specHelper.sinon;

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    let next,
        newMemberHandler,
        goodRequest;

    beforeEach((done) => {
        newMemberHandler = membersController.newMemberHandler;
        sinon.stub(models.Member, 'create');
        sinon.stub(models.Address, 'findOrCreate');

        goodRequest = {
            body: {
                firstName: "Sherlock",
                lastName: "Holmes",
                dateOfBirth: "22 December 1900",
                residentialAddress: {
                    addresss: "221b Baker St",
                    suburb: "London",
                    country: "England",
                    postCode: "1234"
                },
                postalAddress: {
                    addresss: "221b Baker St",
                    suburb: "London",
                    country: "England",
                    postCode: "1234"
                },
                email: "sherlock@holmes.co.uk"
            }
        };

        next = () => {};

        done();
    });

    afterEach((done) => {
        models.Member.create.restore();

        done();
    });

    it("calls next", (done) => {
        next = sinon.stub();
        newMemberHandler(goodRequest, {}, next);

        expect(next).toHaveBeenCalled();
        done();
    });

    xit("creates a new member", (done) => {
        newMemberHandler(goodRequest, {}, next);

        //expect(models.Address.findOrCreate)
        expect(models.Member.create).toHaveBeenCalledWith({
            firstName: "Sherlock",
            lastName: "Holmes",
            dateOfBirth: Date.parse("22 December 1900"),
            residentialAddress: {
                addresss: "221b Baker St",
                suburb: "London",
                country: "England",
                postCode: "1234"
            }
        });

        done();
    });
});
