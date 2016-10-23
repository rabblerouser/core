'use strict';

const models = require('../../../src/models'),
  Member = models.Member,
  Q = require('q'),
  moment = require('moment'),
  uuid = require('node-uuid'),
  sample = require('lodash').sample,
  times = require('lodash').times;

var memberService = require('../../../src/services/memberService');
var branchService = require('../../../src/services/branchService');

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
            primaryPhoneNumber: '0396291146',
            secondaryPhoneNumber: '0394291146',
            residentialAddress: residentialAddress,
            postalAddress: postalAddress,
            membershipType: 'full',
            branchId: 'some-branch-id-1',
            additionalInfo: 'Lots of information'
        };
}

function getExpectedNewMember(residentialAddressId, postalAddressId) {
    return {
        firstName: 'Sherlock',
        lastName: 'Holmes',
        gender: 'horse radish',
        email: 'sherlock@holmes.co.uk',
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

        it('creates a new member in a new branch', (done) => {
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
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    membershipType: 'full',
                    memberSince: sinon.match.any,
                    branchId: 'some-branch-id-1',
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
                expect(createMemberStub).to.have.been.calledWith(sinon.match({
                    residentialAddressId: fakeResidentialAddressId,
                    postalAddressId: fakePostalAddressId
                }));
            })
            .then(done)
            .catch(done);
        });

        it('creates a new member with no address', (done) => {
            branchPromise.resolve(fakeBranch());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(null, null));

            memberService.createMember(fakeNewMember())
            .then(() => {
                expect(addressStub).not.to.have.been.called;
                expect(createMemberStub).to.have.been.calledWith(sinon.match({
                    residentialAddressId: null,
                    postalAddressId: null,
                }));
            })
            .then(done)
            .catch(done);
        });

        it('creates a new member with same residential and postal address', (done) => {
            residentialAddressPromise.resolve(fakeResidentialAddressFromDB());
            postalAddressPromise.resolve(fakeResidentialAddressFromDB());
            branchPromise.resolve(fakeBranch());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(fakeResidentialAddressId, fakeResidentialAddressId));

            let input = fakeNewMember(fakeResidentialAddress(), fakeResidentialAddress());

            memberService.createMember(input)
            .then(() => {
                expect(Member.create).to.have.been.calledWith(sinon.match({
                    residentialAddressId: 1,
                    postalAddressId: 1
                }));
            })
            .then(done)
            .catch(done);
        });

        it('creates a new member with a postal address but no residential address', (done) => {
            postalAddressPromise.resolve(fakePostalAddressFromDB());
            branchPromise.resolve(fakeBranch());
            memberPromise.resolve(fakeResultFromDbWhenSavingMember(null, fakePostalAddressId));

            memberService.createMember(fakeNewMember(null, fakePostalAddress()))
                .then(() => {
                    expect(Member.create).to.have.been.calledWith(sinon.match({
                        residentialAddressId: null,
                        postalAddressId: fakePostalAddressId,
                    }));
                })
                .then(done)
                .catch(done);
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
                    expect(branchService.findById).to.have.been.called;
                    expect(Member.create).not.to.have.been.called;
                    expect(error).to.equal('Create Member failed');
                })
                .then(done)
                .catch(done);
            });

            it('handles db errors when saving the residential address', (done) => {
                residentialAddressPromise.reject('Some DB ERROR the user should not see.');

                let input = fakeNewMember(fakeResidentialAddress(), fakePostalAddress());

                memberService.createMember(input)
                .then(() => {
                    done.fail('createMember should not have succeded. It should have failed.');
                })
                .catch((error) => {
                    expect(Member.create).not.to.have.been.called;
                    expect(error).to.equal('Create Member failed');
                })
                .then(done)
                .catch(done);
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
                    expect(Member.create).not.to.have.been.called;
                    expect(error).to.equal('Create Member failed');
                })
                .then(done)
                .catch(done);
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
                    expect(Member.create).to.have.been.called;
                    expect(error).to.equal('Create Member failed');
                })
                .then(done)
                .catch(done);
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
                expect(result.length).to.equal(3);

                expect(sampleMember.branchId).to.equal('some-branch-id-1');
                expect(sampleMember.id).to.not.be.null;
                expect(sampleMember.email).to.not.be.null;
                expect(sampleMember.firstName).to.not.be.null;
                expect(sampleMember.lastName).to.not.be.null;
                expect(sampleMember.primaryPhoneNumber).to.not.be.null;
                expect(sampleMember.additionalInfo).to.not.be.null;
                expect(sampleMember.notes).to.not.be.null;
            })
            .then(done)
            .catch(done);
        });

        it('returns an empty list if there are no members associated with the branch', (done) => {
            Member.findAll.returns(Promise.resolve([]));

            memberService.list('some-branch-id-1')
            .then((result) => {
                expect(result.length).to.equal(0);
                expect(Member.findAll).to.have.been.called;
            })
            .then(done)
            .catch(done);

        });

        it('returns an empty list if no branch sent', (done) => {
            memberService.list(null)
            .then((result) => {
                expect(Member.findAll).not.to.have.been.called;
                expect(result.length).to.equal(0);
            })
            .then(done)
            .catch(done);
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
                    expect(Member.findAll).to.have.been.called;
                    expect(error).to.equal('An error has occurred while fetching members');
                })
                .then(done)
                .catch(done);
            });
        });
    });

  describe('delete', () => {
    beforeEach(() => {
      sinon.stub(Member, 'destroy');
    });

    afterEach(() => {
      Member.destroy.restore();
    });

    it('should delete the group', done => {
      Member.destroy.returns(Promise.resolve(1));

      memberService.delete('some-member-id')
        .then(() => {
          expect(Member.destroy).to.have.been.calledWith({ where: { id: 'some-member-id' } });
        })
        .then(done)
        .catch(done);
    });

    it('fails when no matching member could be found to delete', () => {
      Member.destroy.returns(Promise.resolve(0));

      return memberService.delete(null)
        .then(() => {
          throw new Error('this should have failed');
        })
        .catch(error => {
          expect(error).to.equal('An error has occurred while deleting the member with id: null');
        });
    });

    it('fails when the DB operation blows up', () => {
      Member.destroy.returns(Promise.reject('DB error the user should not see'));

      return memberService.delete('some-member-id')
        .then(() => {
          throw new Error('this should have failed');
        })
        .catch(error => {
          expect(error).to.equal('An error has occurred while deleting the member with id: some-member-id');
        });
    });
  });
});
