'use strict';

const specHelper = require('../../../support/specHelper'),
      models = specHelper.models,
      Member = models.Member,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      moment = require('moment');

var memberService = require('../../../../src/backend/services/memberService');
var branchService = require('../../../../src/backend/services/branchService');

const fakeDateOfBirth = '22/12/1900';
const formattedDateOfBirth = moment(fakeDateOfBirth, 'DD/MM/YYYY').toDate();
const randomNewMemberId = 1;
const fakeResidentialAddressId = 1;
const fakePostalAddressId = 2;

function fakeBranch() {
    return {
        name: 'Geelong (Vic)',
        id: 'some-branch-id-1',
        key: 'some-branch-ref-key-1'
    };
}

function fakeResidentialAddress() {
    return {
        address: '221b Baker St',
        suburb: 'London',
        country: 'England',
        state: 'VIC',
        postcode: '1234'
    };
}

function fakeResidentialAddressFromDB() {
    let result = [
        {
            dataValues: fakeResidentialAddress()
        }
    ];

    result[0].dataValues.id = fakeResidentialAddressId;
    return result;
}

function fakePostalAddress() {
    return {
        address: '47 I dont want your spam St',
        suburb: 'Moriarty',
        country: 'USA',
        state: 'NM',
        postcode: '5678'
    };
}

function fakePostalAddressFromDB() {
    let result = [
        {
            dataValues: fakePostalAddress()
        }
    ];

    result[0].dataValues.id = fakePostalAddressId;
    return result;
}

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

function fakeNewMember(residentialAddress, postalAddress) {
  return {
            firstName: 'Sherlock',
            lastName: 'Holmes',
            gender: 'horse radish',
            email: 'sherlock@holmes.co.uk',
            dateOfBirth: fakeDateOfBirth,
            primaryPhoneNumber: '0396291146',
            secondaryPhoneNumber: '0394291146',
            residentialAddress: residentialAddress,
            postalAddress: postalAddress,
            membershipType: 'full',
            branch: 'some-branch-ref-key-1',
            schoolType: 'Primary',
            contactFirstName: 'Jaime',
            contactLastName: 'Garzon'
        };
}

function getExpectedNewMember(residentialAddressId, postalAddressId) {
    return {
        firstName: 'Sherlock',
        lastName: 'Holmes',
        gender: 'horse radish',
        email: 'sherlock@holmes.co.uk',
        dateOfBirth: formattedDateOfBirth,
        primaryPhoneNumber: '0396291146',
        secondaryPhoneNumber: '0394291146',
        residentialAddressId: residentialAddressId,
        postalAddress: postalAddressId,
        membershipType: 'full',
        memberSince: moment().format('L')
    };
}

function fakeResultFromDbWhenSavingMember(residentialAddressId, postalAddressId) {
    let result = {
        dataValues: getExpectedNewMember(residentialAddressId, postalAddressId)
    };
    result.dataValues.id = randomNewMemberId;
    return result;
}

describe('memberService', () => {
    describe('createMember', () => {
        let createMemberStub;
        let memberPromise;
        let addressStub;
        let residentialAddressPromise;
        let postalAddressPromise;
        let getBranchStub;
        let branchPromise;

        beforeEach(() => {
            addressStub = sinon.stub(models.Address, 'findOrCreate');

            residentialAddressPromise = Q.defer();
            addressStub
                .withArgs({where: fakeResidentialAddress(), defaults: fakeResidentialAddress()})
                .returns(residentialAddressPromise.promise);

            postalAddressPromise = Q.defer();
            addressStub
                .withArgs({where: fakePostalAddress(), defaults: fakePostalAddress()})
                .returns(postalAddressPromise.promise);

            memberPromise = Q.defer();
            createMemberStub = sinon.stub(models.Member, 'create').returns(memberPromise.promise);

            branchPromise = Q.defer();
            getBranchStub = sinon.stub(branchService, 'findByKey').withArgs('some-branch-ref-key-1').returns(branchPromise.promise);
        });

        afterEach(() => {
            models.Member.create.restore();
            models.Address.findOrCreate.restore();
            branchService.findByKey.restore();
        });

        it('creates a new member in a new branch', (done) => {
            residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
            postalAddressPromise.resolve(fakePostalAddressFromDB());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(fakeResidentialAddressId, fakePostalAddressId));
            branchPromise.resolve(fakeBranch());

            memberService.createMember(fakeNewMember(fakeResidentialAddress(), fakePostalAddress()))
            .then(() => {
                expect(createMemberStub).toHaveBeenCalledWith(jasmine.objectContaining({
                    firstName: 'Sherlock',
                    lastName: 'Holmes',
                    gender: 'horse radish',
                    email: 'sherlock@holmes.co.uk',
                    dateOfBirth: formattedDateOfBirth,
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    residentialAddressId: fakeResidentialAddressId,
                    postalAddressId: fakePostalAddressId,
                    membershipType: 'full',
                    verificationHash: jasmine.anything(),
                    memberSince: jasmine.anything(),
                    lastRenewal: jasmine.anything(),
                    branchId: 'some-branch-id-1',
                    schoolType: 'Primary',
                    contactFirstName: 'Jaime',
                    contactLastName: 'Garzon'
                }));
            }).then(done, done.fail);
        });

        it('creates a new member with different residential and postal addresses', (done) => {
            residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
            postalAddressPromise.resolve(fakePostalAddressFromDB());
            branchPromise.resolve(fakeBranch());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(fakeResidentialAddressId, fakePostalAddressId));

            memberService.createMember(fakeNewMember(fakeResidentialAddress(), fakePostalAddress()))
            .then(() => {
                expect(createMemberStub).toHaveBeenCalledWith(jasmine.objectContaining({
                    residentialAddressId: fakeResidentialAddressId,
                    postalAddressId: fakePostalAddressId
                }));
            }).then(done, done.fail);
        });

        it('creates a new member with no address', (done) => {
            branchPromise.resolve(fakeBranch());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(null, null));

            memberService.createMember(fakeNewMember())
            .then(() => {
                expect(addressStub).not.toHaveBeenCalled();
                expect(createMemberStub).toHaveBeenCalledWith(jasmine.objectContaining({
                    residentialAddressId: null,
                    postalAddressId: null,
                }));
            }).then(done, done.fail);
        });

        it('creates a new member with same residential and postal address', (done) => {
            residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
            postalAddressPromise.resolve(fakeResidentialAddressFromDB());
            branchPromise.resolve(fakeBranch());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(fakeResidentialAddressId, fakeResidentialAddressId));

            let input = fakeNewMember(fakeResidentialAddress(), fakeResidentialAddress());

            memberService.createMember(input)
            .then(() => {
                expect(Member.create).toHaveBeenCalledWith(jasmine.objectContaining({
                    residentialAddressId: 1,
                    postalAddressId: 1
                }));
            }).then(done, done.fail);
        });

        describe('things went bad', () => {
            it('handles error when retrieving the branch', (done) => {
                branchPromise.reject('Some ERROR thrown by the branch service');

                let input = fakeNewMember(null, null);

                memberService.createMember(input)
                .then(() => {
                    done.fail('createMember should not have succeded. It should have failed.');
                })
                .catch((error) => {
                    expect(branchService.findByKey).toHaveBeenCalled();
                    expect(models.Member.create).not.toHaveBeenCalled();
                    expect(error).toEqual('Create Member failed');
                })
                .then(done, done.fail);
            });

            it('handles db errors when saving the residential address', (done) => {
                residentialAddressPromise.reject('Some DB ERROR the user should not see.');

                let input = fakeNewMember(fakeResidentialAddress(), fakePostalAddress());

                memberService.createMember(input)
                .then(() => {
                    done.fail('createMember should not have succeded. It should have failed.');
                })
                .catch((error) => {
                    expect(models.Member.create).not.toHaveBeenCalled();
                    expect(error).toEqual('Create Member failed');
                })
                .then(done, done.fail);
            });

            it('handles db errors when saving the postal address', (done) => {
                residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
                postalAddressPromise.reject('Some DB ERROR the user should not see.');

                let input = fakeNewMember(fakeResidentialAddress(), fakePostalAddress());

                memberService.createMember(input)
                .then(() => {
                    done.fail('createMember should not have succeded. It should have failed.');
                })
                .catch((error) => {
                    expect(models.Member.create).not.toHaveBeenCalled();
                    expect(error).toEqual('Create Member failed');
                })
                .then(done, done.fail);
            });

            it('handles db erros when saving the member to the database', (done) => {
                residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
                postalAddressPromise.resolve(fakePostalAddressFromDB());
                branchPromise.resolve(fakeBranch());
                memberPromise.reject('Some DB ERROR the user should not see.');

                let input = fakeNewMember(fakeResidentialAddress(), fakePostalAddress());

                memberService.createMember(input)
                .then(() => {
                    done.fail('createMember should not have succeded. It should have failed.');
                })
                .catch((error) => {
                    expect(models.Member.create).toHaveBeenCalled();
                    expect(error).toEqual('Create Member failed');
                })
                .then(done, done.fail);
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
        });

        afterEach(() => {
            models.Member.findAll.restore();
        });

        it('resolves with a list of raw members', (done) => {
            models.Member.findAll
                .withArgs(expectedMemberQuery)
                .returns(Promise.resolve(findQueryResult));

            memberService.list().then((result) => {
                expect(result).toEqual([member]);
            }).then(done, done.fail);
        });

        it('should handle errors', (done) => {
            models.Member.findAll
                .returns(Promise.reject('bad bad bad'));

            memberService.list()
            .then(() => {
                done.fail('This should not be resolving successfully');
            })
            .catch((error) => {
                expect(error).toEqual('An error has occurred while fetching members');
            }).then(done, done.fail);
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

        let updateMemberStub, addressStub, findUserStub,
            residentialAddress, postalAddress, updateMemberPromise,
            currentMember, updatedMember,
            residentialAddressPromise, postalAddressPromise;

        beforeEach(() => {
            updateMemberStub = sinon.stub(models.Member, 'update');
            addressStub = sinon.stub(models.Address, 'findOrCreate');
            findUserStub = sinon.stub(models.Member, 'find');

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
            }).then(done, done.fail);
        });

        it('throws error and rejects promise if email does not exist', (done) => {
            Member.find
                .withArgs({where: {email: 'sherlock@holmes.co.uk'}})
                .returns(Promise.reject('email not found'));

            memberService.updateMember(updatedMember, {where: {email: 'fakeyfakey@something.com'}}).catch((error) => {
                expect(error).toEqual('email not found');
            }).then(done, done.fail);
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
        let query = { where: {lastRenewal: moment(expiredOn, 'L').subtract(1, 'year').toDate()}, attributes: ['id', 'email']};

        memberService.findMembershipsExpiringOn(expiredOn)
        .then((result) => {
          expect(result.length).toEqual(0);
          expect(models.Member.findAll).toHaveBeenCalledWith(query);
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

    describe('renewMember', () => {
        let findOneStub;
        let findOnePromise;
        let updateMemberPromise;
        let updateMemberStub;

        beforeEach(() => {
            findOnePromise = Q.defer();
            findOneStub = sinon.stub(models.Member, 'findOne').returns(findOnePromise.promise);
            updateMemberPromise = Q.defer();
            updateMemberStub = sinon.stub(models.Member, 'update').returns(updateMemberPromise.promise);
        });

        afterEach(() => {
            models.Member.findOne.restore();
            models.Member.update.restore();
        });

        it('should set the lastRenewal date if member was found', (done) => {
            let memberToRenew = { dataValues: { } };
            findOnePromise.resolve(memberToRenew);
            updateMemberPromise.resolve(memberToRenew);

            memberService.renewMember('potato')
                .then((member) => {
                    expect(member.lastRenewal).toEqual(moment().format('L'));
                })
                .finally(() => {
                    expect(models.Member.findOne).toHaveBeenCalled();
                    expect(updateMemberStub).toHaveBeenCalled();
                    done();
                })
                .catch(done);
        });

        it('should throw an error if member was not found', (done) => {
            findOnePromise.reject();

            memberService.renewMember('potato')
                .then((member) => {
                    expect(member.lastRenewal).toBeUndefined();
                })
                .finally(() => {
                    expect(models.Member.findOne).toHaveBeenCalled();
                    expect(updateMemberStub).not.toHaveBeenCalled();
                    done();
                })
                .catch(done);
        });
    });
});
