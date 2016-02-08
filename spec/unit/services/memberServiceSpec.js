'use strict';

const specHelper = require('../../support/specHelper'),
      models = specHelper.models,
      Member = models.Member,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      logger = specHelper.logger,
      moment = require('moment');

var memberService = require('../../../services/memberService');

function getUpdatedMember(residentialAddress, postalAddress, date) {
    return {
        firstName: 'Shurley',
        lastName: 'Temple',
        gender: 'rabbit carrot',
        email: 'sherlock@holmes.co.uk',
        dateOfBirth: date,
        primaryPhoneNumber: '0396291146',
        secondaryPhoneNumber: '0394291146',
        residentialAddress: residentialAddress,
        postalAddress: postalAddress,
        membershipType: 'full'
    };
}

function fakeNewMember(residentialAddress, postalAddress, date) {
  return {
            firstName: 'Sherlock',
            lastName: 'Holmes',
            gender: 'horse radish',
            email: 'sherlock@holmes.co.uk',
            dateOfBirth: date,
            primaryPhoneNumber: '0396291146',
            secondaryPhoneNumber: '0394291146',
            residentialAddress: residentialAddress,
            postalAddress: postalAddress,
            membershipType: 'full'
        };
}

function getExpectedNewMember(residentialAddressId, postalAddressId, dateOfBirth) {
    let momentDate = moment(dateOfBirth, 'DD/MM/YYYY').toDate();

    let member = fakeNewMember(residentialAddressId, postalAddressId, momentDate);
    member.memberSince = moment().format('L');

    member.residentialAddressId = member.residentialAddress;
    delete(member.residentialAddress);

    member.postalAddressId = member.postalAddress;
    delete(member.postalAddress);
    return member;
}

describe('memberService', () => {
    describe('createMember', () => {
        const residentialAddressId = 1;
        const postalAddressId = 2;
        const randomNewMemberId = 1;
        const date = '22/12/1900';
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

        let createMemberStub, addressStub, loggerStub,
            residentialAddress, postalAddress,
            newMember, expectedNewMember, createdMemberFromDb,
            residentialAddressPromise, postalAddressPromise, memberPromise;

        beforeEach(() => {
            createMemberStub = sinon.stub(models.Member, 'create');
            addressStub = sinon.stub(models.Address, 'findOrCreate');
            loggerStub = sinon.stub(logger, 'logMemberSignUpEvent');

            residentialAddress = {
                address: '221b Baker St',
                suburb: 'London',
                country: 'England',
                state: 'VIC',
                postcode: '1234'
            };
            postalAddress = {
                address: '47 I dont want your spam St',
                suburb: 'Moriarty',
                country: 'USA',
                state: 'NM',
                postcode: '5678'
            };

            newMember = fakeNewMember(residentialAddress, postalAddress, date);
            expectedNewMember = getExpectedNewMember(residentialAddressId, postalAddressId, date);
            createdMemberFromDb = {
              dataValues : expectedNewMember
            };
            createdMemberFromDb.dataValues.id = randomNewMemberId;


            residentialAddressPromise = Q.defer();
            addressStub
                .withArgs({where: residentialAddress, defaults: residentialAddress})
                .returns(residentialAddressPromise.promise);

            postalAddressPromise = Q.defer();
            addressStub
                .withArgs({where: postalAddress, defaults: postalAddress})
                .returns(postalAddressPromise.promise);

            memberPromise = Q.defer();
            createMemberStub.returns(memberPromise.promise);
        });

        afterEach(() => {
            models.Member.create.restore();
            models.Address.findOrCreate.restore();
            loggerStub.restore();
        });

        it('creates a new member and address', (done) => {
            residentialAddressPromise.resolve(residentialAddressFromDb);
            postalAddressPromise.resolve(postalAddressFromDb);
            memberPromise.resolve(createdMemberFromDb);

            memberService.createMember(newMember)
                .finally((createdMember) => {
                    expect(createdMember.firstName).toEqual(expectedNewMember.firstName);
                    expect(createdMember.id).toEqual(randomNewMemberId);

                    expect(Member.create).toHaveBeenCalledWith(jasmine.objectContaining(expectedNewMember));
                }).nodeify(done);
        });

        it('logs the member sign up event', (done) => {
            residentialAddressPromise.resolve(residentialAddressFromDb);
            postalAddressPromise.resolve(postalAddressFromDb);

            memberPromise.resolve(createdMemberFromDb);

            memberService.createMember(newMember)
                .finally(() => {
                    expect(logger.logMemberSignUpEvent).toHaveBeenCalledWith(expectedNewMember);
                }).nodeify(done);
        });

        describe('when postal and residential address are identical', () => {
            it('set them both to same value', (done) => {
                newMember = fakeNewMember(residentialAddress, residentialAddress, date);
                expectedNewMember = getExpectedNewMember(residentialAddressId, residentialAddressId, date);

                residentialAddressPromise.resolve(residentialAddressFromDb);
                postalAddressPromise.resolve(postalAddressFromDb);
                memberPromise.resolve(createdMemberFromDb);

                memberService.createMember(newMember)
                    .finally(() => {
                        expect(Member.create).toHaveBeenCalledWith(jasmine.objectContaining(expectedNewMember));
                    }).nodeify(done);
            });
        });

        describe('an error when saving the residential address to the database', () => {
            it('responds with a server error', (done) => {
                let errorMessage = 'Yes, we have no bananas.';
                residentialAddressPromise.reject(errorMessage);

                let promise = memberService.createMember(newMember);

                promise.finally(() => {
                    expect(models.Member.create).not.toHaveBeenCalled();
                    expect(promise.isRejected()).toBe(true);
                    done();
                });
            });
        });

        describe('an error when saving the postal address to the databse', () => {
            it('responds with a server error', (done) => {
                let errorMessage = 'Yes, we have no horses.';
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

        describe('an error when saving the member to the database', () => {
            it('rejects the promise', (done) => {
                let errorMessage = 'Seriously, we still don\'t have any damn bananas.';
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

    describe('list', () => {
        let member,
            residentialAddress,
            expectedMemberQuery,
            findQueryResult,
            Promise = models.Sequelize.Promise;


        beforeEach(() => {
            residentialAddress = {
                postcode: 1234,
                state: 'VIC',
                country: 'Australia'
            };
            member = {
                firstName: 'Sherlock',
                lastName: 'Halmes',
                membershipType: 'full',
                verified: null,
                residentialAddress: residentialAddress
            };

             expectedMemberQuery = {
                include: [{
                    model: models.Address,
                    as: 'residentialAddress',
                    attributes: ['postcode', 'state', 'country']
                }],
                attributes: [
                    'id',
                    'firstName',
                    'lastName',
                    'membershipType',
                    'verified'
                ]
            };

             findQueryResult = [{
                dataValues: Object.assign({}, member, {
                    residentialAddress: {
                        dataValues: residentialAddress
                    }
                })
            }];

            sinon.stub(models.Member, 'findAll');
            sinon.stub(logger, 'logError');
        });

        afterEach(() => {
            models.Member.findAll.restore();
            logger.logError.restore();
        });

        it('resolves with a list of raw members', (done) => {
            models.Member.findAll
                .withArgs(expectedMemberQuery)
                .returns(Promise.resolve(findQueryResult));

            memberService.list().then((result) => {
                expect(result).toEqual([member]);
            }).nodeify(done);
        });

        it('logs an error if there is an error, and ensures the promise is rejected', (done) => {
            models.Member.findAll
                .returns(Promise.reject('bad bad bad'));

            memberService.list().catch((error) => {
                expect(logger.logError).toHaveBeenCalledWith('bad bad bad');
                expect(error).toEqual('An error has occurred while fetching members');
            }).nodeify(done);
        });
    });

    describe('verify', () => {
      let findOneStub;
      let findOnePromise;
      let updateMemberPromise;
      let updateMemberStub;

      beforeEach(() => {
        findOnePromise = Q.defer();
        findOneStub = sinon.stub(models.Member, 'findOne').returns(findOnePromise.promise);

        updateMemberPromise = Q.defer();
        updateMemberStub = sinon.stub().returns(updateMemberPromise.promise);
      });

      afterEach(() => {
        models.Member.findOne.restore();
      });

      it('should verify the member if email and hash match', (done) => {
        let hash = '1d225bd0-57b5-4b87-90fc-f76ddc997e57';

        updateMemberPromise.resolve({dataValues: {email: 'sherlock@holmes.co.uk', verified: moment().format(), id: '1'}});

        let memberToVerify = {dataValues: {email: 'sherlock@holmes.co.uk', verified: null, id: '1'}, update: updateMemberStub};
        findOnePromise.resolve(memberToVerify);

        memberService.verify(hash)
        .then((member) => {
          expect(member.email).toEqual('sherlock@holmes.co.uk');
        })
        .finally(() => {
          expect(models.Member.findOne).toHaveBeenCalled();
          expect(updateMemberStub).toHaveBeenCalled();
          done();
        })
        .catch(done);
      });

      it('should not verify the member if already verified', (done) => {
        let hash = '1d225bd0-57b5-4b87-90fc-f76ddc997e57';

        findOnePromise.resolve({dataValues: {email: 'sherlock@holmes.co.uk', verified: moment().format(), id: '1'}});

        memberService.verify(hash)
        .then((member) => {
          expect(member.email).toEqual('sherlock@holmes.co.uk');
        })
        .finally(() => {
          expect(models.Member.findOne).toHaveBeenCalled();
          expect(updateMemberStub).not.toHaveBeenCalled();
          done();
        })
        .catch(done);
      });

      it('should throw an error if hash does not match any record', (done) => {
        let hash = '1d225bd0-57b5-4b87-90fc-f76ddc997e57';

        findOnePromise.resolve(null);

        memberService.verify(hash)
        .catch((error) => {
          expect(error).not.toBeNull();
          expect(models.Member.findOne).toHaveBeenCalled();
          expect(updateMemberStub).not.toHaveBeenCalled();
          done();
        });
      });

    });

    describe('update member', () => {
        const residentialAddressId = 1;
        const postalAddressId = 2;
        const date = '22/12/1900';
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

        let updateMemberStub, addressStub, loggerStub, findUserStub,
            residentialAddress, postalAddress, updateMemberPromise,
            currentMember, updatedMember,
            residentialAddressPromise, postalAddressPromise;

        beforeEach(() => {
            updateMemberStub = sinon.stub(models.Member, 'update');
            addressStub = sinon.stub(models.Address, 'findOrCreate');
            findUserStub = sinon.stub(models.Member, 'find');
            loggerStub = sinon.stub(logger, 'logMemberSignUpEvent');

            residentialAddress = {
                address: '221b Baker St',
                suburb: 'London',
                country: 'England',
                state: 'VIC',
                postcode: '1234'
            };
            postalAddress = {
                address: '47 I dont want your spam St',
                suburb: 'Moriarty',
                country: 'USA',
                state: 'NM',
                postcode: '5678'
            };

            currentMember = getExpectedNewMember(residentialAddress, postalAddress, date);
            updatedMember = getUpdatedMember(residentialAddress, postalAddress, date);

            residentialAddressPromise = Q.defer();
            addressStub
                .withArgs({where: residentialAddress, defaults: residentialAddress})
                .returns(residentialAddressPromise.promise);

            postalAddressPromise = Q.defer();
            addressStub
                .withArgs({where: postalAddress, defaults: postalAddress})
                .returns(postalAddressPromise.promise);

            updateMemberPromise = Q.defer();
            updateMemberStub.returns(updateMemberPromise.promise);
        });

        afterEach(() => {
            models.Address.findOrCreate.restore();
            models.Member.find.restore();
            models.Member.update.restore();
            loggerStub.restore();
        });

        it('successfully updates users details using email', (done) => {
            residentialAddressPromise.resolve(residentialAddressFromDb);
            postalAddressPromise.resolve(postalAddressFromDb);
            Member.find
                .withArgs({where: {email: 'sherlock@holmes.co.uk'}})
                .returns(Promise.resolve(currentMember));
            updateMemberPromise.resolve(updatedMember);

            memberService.updateMember(updatedMember, {where: {email: 'sherlock@holmes.co.uk'}}).then((result) => {
                expect(models.Member.update).toHaveBeenCalled();
                expect(result.lastName).toEqual('Temple');
            })
                .nodeify(done);
        });

        it('throws error and rejects promise if email does not exist', (done) => {
            Member.find
                .withArgs({where: {email: 'sherlock@holmes.co.uk'}})
                .returns(Promise.reject('email not found'));

            memberService.updateMember(updatedMember, {where: {email: 'fakeyfakey@something.com'}}).catch((error) => {
                expect(error).toEqual('email not found');
            }).nodeify(done);
        });
    });

    describe('findMembershipsExpiringOn', () => {
      let findAllStub;
      let findAllPromise;

      beforeEach(() => {
        findAllPromise = Q.defer();
        findAllStub = sinon.stub(models.Member, 'findAll').returns(findAllPromise.promise);
      });

      afterEach(() => {
        models.Member.findAll.restore();
      });


      it('should return an empty array if no memberships expiring on the date', (done) => {
        findAllPromise.resolve([]);
        let expiredOn = moment().format('L');

        memberService.findMembershipsExpiringOn(expiredOn)
        .then((result) => {
          expect(result.length).toEqual(0);
          expect(models.Member.findAll).toHaveBeenCalled();
          done();
        })
        .catch(done);
      });

      it('should return an empty array if no date defined', (done) => {
        memberService.findMembershipsExpiringOn(null)
        .then((result) => {
          expect(result.length).toEqual(0);
          expect(models.Member.findAll).not.toHaveBeenCalled();
          done();
        })
        .catch(done);
      });

      it('should return memberships expiring on the date', (done) => {
        findAllPromise.resolve([
            {
                dataValues:
                {
                    id: '2d4f3fac-e3ec-48b1-a01f-70edd0a22f23',
                    email: 'difydubif@yahoo.com'
                }
            }]);

        let expiredOn = moment().format('L');

        memberService.findMembershipsExpiringOn(expiredOn)
        .then((result) => {
            expect(result.length).toEqual(1);
            expect(result[0].email).toEqual('difydubif@yahoo.com');
            expect(models.Member.findAll).toHaveBeenCalled();
            done();
        })
        .catch(done);
      });
    });
});
