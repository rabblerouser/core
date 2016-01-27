'use strict';

const specHelper = require('../../support/specHelper'),
      models = specHelper.models,
      Member = models.Member,
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      logger = specHelper.logger,
      moment = require('moment');

var memberService = require('../../../services/memberService');

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

    member.residentialAddressId = member.residentialAddress;
    delete(member.residentialAddress);

    member.postalAddressId = member.postalAddress;
    delete(member.postalAddress);

    member.verified = false;

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
});
