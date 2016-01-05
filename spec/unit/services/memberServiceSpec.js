"use strict";

const specHelper = require("../../support/specHelper"),
      models = specHelper.models,
      Member = models.Member,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      logger = specHelper.logger;

var memberService = require("../../../services/memberService");

describe("memberService", () => {
    describe("createMember", () => {
        const residentialAddressId = 1;
        const postalAddressId = 2;
        const residentialAddressFromDb = [
            {
                dataValues: {
                    id: residentialAddressId
                }
            }
        ];
        const postalAddressFromDb = [
            {
                dataValues: {
                    id: postalAddressId
                }
            }
        ];

        let memberStub, addressStub, loggerStub,
            residentialAddress, postalAddress,
            newMember, expectedNewMember,
            residentialAddressPromise, postalAddressPromise, memberPromise;

        let makeNewMember = (residentialAddress, postalAddress) => {
            return {
                firstName: "Sherlock",
                lastName: "Holmes",
                email: "sherlock@holmes.co.uk",
                dateOfBirth: "22 December 1900",
                phoneNumber: "0396291146",
                residentialAddress: residentialAddress,
                postalAddress: postalAddress
            };
        };

        beforeEach(() => {
            memberStub = sinon.stub(models.Member, 'create');
            addressStub = sinon.stub(models.Address, 'findOrCreate');
            loggerStub = sinon.stub(logger, 'info');

            residentialAddress = {
                address: "221b Baker St",
                suburb: "London",
                country: "England",
                state: "VIC",
                postcode: "1234"
            };
            postalAddress = {
                address: "47 I dont want your spam St",
                suburb: "Moriarty",
                country: "USA",
                state: "NM",
                postcode: "5678"
            };

            newMember = makeNewMember(residentialAddress, postalAddress);
            expectedNewMember = makeNewMember(residentialAddressId, postalAddressId);

            residentialAddressPromise = Q.defer();
            addressStub
                .withArgs({where: residentialAddress, defaults: residentialAddress})
                .returns(residentialAddressPromise.promise);

            postalAddressPromise = Q.defer();
            addressStub
                .withArgs({where: postalAddress, defaults: postalAddress})
                .returns(postalAddressPromise.promise);

            memberPromise = Q.defer();
            memberStub.returns(memberPromise.promise);
        });

        afterEach(() => {
            models.Member.create.restore();
            models.Address.findOrCreate.restore();
            loggerStub.restore();
        });

        it("creates a new member and address", (done) => {
            residentialAddressPromise.resolve(residentialAddressFromDb);
            postalAddressPromise.resolve(postalAddressFromDb);
            memberPromise.resolve();

            memberService.createMember(newMember)
                .then(() => {
                    expect(Member.create).toHaveBeenCalledWith(expectedNewMember);
                }).nodeify(done);
        });

        it("logs the member sign up event", (done) => {
            residentialAddressPromise.resolve(residentialAddressFromDb);
            postalAddressPromise.resolve(postalAddressFromDb);
            memberPromise.resolve();

            memberService.createMember(newMember)
                .then(() => {
                    expect(logger.info).toHaveBeenCalledWith(newMember);
                }).nodeify(done);
        });

        describe("when postal and residential address are identical", () => {
            it("set them both to same value", (done) => {
                newMember = makeNewMember(residentialAddress, residentialAddress);
                expectedNewMember = makeNewMember(residentialAddressId, residentialAddressId);

                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.resolve(postalAddressFromDb);
                memberPromise.resolve();

                memberService.createMember(newMember)
                    .then(() => {
                        expect(Member.create).toHaveBeenCalledWith(expectedNewMember);
                    }).nodeify(done);
            });
        });

        describe("an error when saving the residential address to the database", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Yes, we have no bananas.";
                residentialAddressPromise.reject(errorMessage);

                let promise = memberService.createMember(newMember);

                promise.finally(() => {
                    expect(models.Member.create).not.toHaveBeenCalled();
                    expect(promise.isRejected()).toBe(true);
                    done();
                });
            });
        });

        describe("an error when saving the postal address to the databse", () => {
            it("responds with a server error", (done) => {
                let errorMessage = "Yes, we have no horses.";
                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.reject(errorMessage);

                let promise = memberService.createMember(newMember);

                promise.finally(() => {
                    expect(models.Member.create).not.toHaveBeenCalled();
                    expect(promise.isRejected()).toBe(true);
                    done();
                });
            });
        });

        describe("an error when saving the member to the database", () => {
            it("rejects the promise", (done) => {
                let errorMessage = "Seriously, we still don't have any damn bananas.";
                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.resolve(postalAddressFromDb);
                memberPromise.reject(errorMessage);

                let promise = memberService.createMember(newMember);

                promise.finally(() => {
                    expect(promise.isRejected()).toBe(true);
                    done();
                });
            });
        });
    });
});
