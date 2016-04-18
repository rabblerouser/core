'use strict';

const models = require('../../../../src/backend/models'),
  Member = models.Member,
  sinon = require('sinon'),
  chai = require('chai'),
  expect = chai.expect,
  Q = require('q'),
  moment = require('moment'),
  uuid = require('node-uuid'),
  sample = require('lodash').sample,
  times = require('lodash').times,
  sinonChai = require('sinon-chai');

chai.use(sinonChai);

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
        id: 'some-branch-id-1'
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
            branchId: 'some-branch-id-1',
            schoolType: 'Primary',
            contactFirstName: 'Jaime',
            contactLastName: 'Garzon',
            additionalInfo: 'Lots of information'
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
        memberSince: moment().format('L'),
        branchId: 'some-branch-id-1'
    };
}

function fakeResultFromDbWhenSavingMember(residentialAddressId, postalAddressId) {
    let result = {
        dataValues: getExpectedNewMember(residentialAddressId, postalAddressId)
    };
    result.dataValues.id = randomNewMemberId;
    return result;
}

function fakeMembersList(membersQty) {
    let membersList = [];

    times(membersQty, () => {
        let dbResponse = fakeResultFromDbWhenSavingMember();
        dbResponse.dataValues.id = uuid.v4();
        dbResponse.dataValues.branch = { dataValues: fakeBranch()};

        membersList.push(dbResponse);
    });

    return membersList;
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
            createMemberStub = sinon.stub(Member, 'create').returns(memberPromise.promise);

            branchPromise = Q.defer();
            getBranchStub = sinon.stub(branchService, 'findById').withArgs('some-branch-id-1').returns(branchPromise.promise);
        });

        afterEach(() => {
            Member.create.restore();
            models.Address.findOrCreate.restore();
            branchService.findById.restore();
        });

        it.only('creates a new member in a new branch', (done) => {
            residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
            postalAddressPromise.resolve(fakePostalAddressFromDB());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(fakeResidentialAddressId, fakePostalAddressId));
            branchPromise.resolve(fakeBranch());

            memberService.createMember(fakeNewMember(fakeResidentialAddress(), fakePostalAddress()))
            .then(() => {
                expect(createMemberStub).to.have.been.calledWith(sinon.match({
                    firstName: 'Sherlock',
                    lastName: 'Holmes',
                    gender: 'horse radish',
                    email: 'sherlock@holmes.co.uk',
                    dateOfBirth: formattedDateOfBirth,
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    membershipType: 'full',
                    memberSince: sinon.match.any,
                    branchId: 'some-branch-id-1',
                    schoolType: 'Primary',
                    contactFirstName: 'Jaime',
                    contactLastName: 'Garzon',
                    additionalInfo: 'Lots of information'
                }));
            })
            .then(done)
            .catch(done);
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
                    expect(branchService.findById).toHaveBeenCalled();
                    expect(Member.create).not.toHaveBeenCalled();
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
                    expect(Member.create).not.toHaveBeenCalled();
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
                    expect(Member.create).not.toHaveBeenCalled();
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
                    expect(Member.create).toHaveBeenCalled();
                    expect(error).toEqual('Create Member failed');
                })
                .then(done, done.fail);
            });
        });
    });

    describe('list', () => {
        let Promise = models.Sequelize.Promise;

        beforeEach(() => {
            sinon.stub(Member, 'findAll');
        });

        afterEach(() => {
            Member.findAll.restore();
        });

        it('returns a list of members for a specific branch', (done) => {
            Member.findAll
                .returns(Promise.resolve(fakeMembersList(3)));

            memberService.list('some-branch-id-1')
            .then((result) => {
                let sampleMember = sample(result);
                expect(result.length).toEqual(3);

                expect(sampleMember.branchId).toEqual('some-branch-id-1');
                expect(sampleMember.id).not.toBeNull();
                expect(sampleMember.email).not.toBeNull();
                expect(sampleMember.firstName).not.toBeNull();
                expect(sampleMember.lastName).not.toBeNull();
                expect(sampleMember.primaryPhoneNumber).not.toBeNull();
                expect(sampleMember.dateOfBirth).not.toBeNull();
                expect(sampleMember.contactFirstName).not.toBeNull();
                expect(sampleMember.contactLastName).not.toBeNull();
                expect(sampleMember.schoolType).not.toBeNull();
                expect(sampleMember.additionalInfo).not.toBeNull();
                expect(sampleMember.pastoralNotes).not.toBeNull();
            })
            .then(done, done.fail);
        });

        it('it should return the list of groups for each member', (done) => {
            Member.findAll
                .returns(Promise.resolve(fakeMembersList(3)));

            memberService.list('some-branch-id-1')
            .then((result) => {
                let sampleMember = sample(result);
                expect(result.length).toEqual(3);

                expect(sampleMember.branchId).toEqual('some-branch-id-1');
                expect(sampleMember.id).not.toBeNull();
                expect(sampleMember.email).not.toBeNull();
                expect(sampleMember.firstName).not.toBeNull();
                expect(sampleMember.lastName).not.toBeNull();
                expect(sampleMember.primaryPhoneNumber).not.toBeNull();
                expect(sampleMember.dateOfBirth).not.toBeNull();
                expect(sampleMember.contactFirstName).not.toBeNull();
                expect(sampleMember.contactLastName).not.toBeNull();
                expect(sampleMember.schoolType).not.toBeNull();
                expect(sampleMember.additionalInfo).not.toBeNull();
                expect(sampleMember.pastoralNotes).not.toBeNull();
            })
            .then(done, done.fail);
        });

        it('returns an empty list if there are no members associated with the branch', (done) => {
            Member.findAll.returns(Promise.resolve([]));

            memberService.list('some-branch-id-1')
            .then((result) => {
                expect(result.length).toEqual(0);
                expect(Member.findAll).toHaveBeenCalled();
            })
            .then(done, done.fail);

        });

        it('returns an empty list if no branch sent', (done) => {
            memberService.list(null)
            .then((result) => {
                expect(Member.findAll).not.toHaveBeenCalled();
                expect(result.length).toEqual(0);
            }).then(done, done.fail);
        });

        describe('sad path', () => {

            it('should handle db errors', (done) => {
                Member.findAll
                    .returns(Promise.reject('A DB error the service should not rethrow'));

                memberService.list('some-branch-id-1')
                .then(() => {
                    done.fail('This should not be resolving successfully');
                })
                .catch((error) => {
                    expect(Member.findAll).toHaveBeenCalled();
                    expect(error).toEqual('An error has occurred while fetching members');
                }).then(done, done.fail);
            });
        });
    });

    describe('edit', () => {
        it('should edit the member when no groups are sent');
    });

});
