'use strict';

const specHelper = require("../../support/specHelper"),
    models = specHelper.models,
    sinon = specHelper.sinon,
    Q = specHelper.Q;

var membersController = require("../../../controllers/membersController");

describe("membersController", () => {
    let next,
        newMemberHandler,
        goodRequest,
        addressStub, memberStub,
        newAddress,
        addressPromise, memberPromise;

    beforeEach((done) => {
        newMemberHandler = membersController.newMemberHandler;
        memberStub = sinon.stub(models.Member, 'create');
        addressStub = sinon.stub(models.Address, 'findOrCreate');

        newAddress = {
            address: "221b Baker St",
            suburb: "London",
            country: "England",
            state: "VIC",
            postcode: "1234"
        };

        goodRequest = {
            body: {
                firstName: "Sherlock",
                lastName: "Holmes",
                email: "sherlock@holmes.co.uk",
                dateOfBirth: "22 December 1900",
                phoneNumber: "0396291146",
                residentialAddress: newAddress,
                postalAddress: newAddress
            }
        };

        addressPromise = Q.defer();
        addressStub
            .withArgs({where: newAddress, defaults: newAddress})
            .returns(addressPromise.promise);
        memberPromise = Q.defer();
        memberStub.returns(memberPromise.promise);

        next = () => {};

        done();
    });

    afterEach((done) => {
        models.Member.create.restore();
        models.Address.findOrCreate.restore();

        done();
    });

    it("calls next", (done) => {
        next = sinon.stub();
        newMemberHandler(goodRequest, {}, next);

        addressPromise.resolve(1);
        addressPromise.promise.then( () => {

            memberPromise.resolve(1);
            memberPromise.promise.then(() => {
                expect(next).toHaveBeenCalled();
            }).nodeify(done);
        });
    });

    it("creates a new member", (done) => {
        newMemberHandler(goodRequest, {}, next);
        addressPromise.resolve(1);
        addressPromise.promise.then(() => {
            expect(models.Member.create).toHaveBeenCalledWith({
                firstName: "Sherlock",
                lastName: "Holmes",
                email: "sherlock@holmes.co.uk",
                dateOfBirth: Date.parse("22 December 1900"),
                phoneNumber: "0396291146",
                residentialAddress: 1,
                postalAddress: 1
            });
        }).nodeify(done);
    });
});