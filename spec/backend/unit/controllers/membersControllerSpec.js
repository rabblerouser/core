'use strict';

const specHelper = require('../../../support/specHelper'),
      sinon = specHelper.sinon,
      Q = specHelper.Q,
      memberService = require('../../../../src/backend/services/memberService'),
      memberValidator = require('../../../../src/backend/lib/memberValidator');

var membersController = require('../../../../src/backend/controllers/membersController');

describe('membersController', () => {

    describe('register', () => {
        let register,
            goodRequest, res,
            residentialAddress, postalAddress,
            createMemberStub, createMemberPromise,
            validateMemberStub;

        beforeEach(() => {
            register = membersController.register;
            createMemberStub = sinon.stub(memberService, 'createMember');
            validateMemberStub = sinon.stub(memberValidator, 'isValid');
            res = {status: sinon.stub().returns({json: sinon.spy()})};

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

            goodRequest = {
                body: {
                    firstName: 'Sherlock',
                    lastName: 'Holmes',
                    email: 'sherlock@holmes.co.uk',
                    gender: 'detective genius',
                    dateOfBirth: '22/12/1900',
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: 'full',
                    contactFirstName: 'Jaime',
                    contactLastName: 'Garzon',
                    schoolType: 'Primary',
                    branch: 'some-id-1',
                    additionalInfo: null
                }
            };

            createMemberPromise = Q.defer();
            createMemberStub
                .withArgs(goodRequest.body)
                .returns(createMemberPromise.promise);
        });

        afterEach(() => {
            memberService.createMember.restore();
            memberValidator.isValid.restore();
        });

        describe('when it receives a good request', () => {
            let expectedMemberCreateValues;
            let createdMember = {id:'1234', membershipType: 'full', email: 'sherlock@holmes.co.uk'};

            beforeEach(() => {
                validateMemberStub.returns([]);
                createMemberPromise.resolve(createdMember);

                expectedMemberCreateValues = {
                    firstName: 'Sherlock',
                    lastName: 'Holmes',
                    email: 'sherlock@holmes.co.uk',
                    gender: 'detective genius',
                    dateOfBirth: '22/12/1900',
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: 'full',
                    contactFirstName: 'Jaime',
                    contactLastName: 'Garzon',
                    schoolType: 'Primary',
                    branch: 'some-id-1'
                };
            });

            it('creates a new member', (done) => {
                register(goodRequest, res)
                .finally(() => {
                    expect(res.status).toHaveBeenCalledWith(200);
                    expect(res.status().json).toHaveBeenCalledWith({newMember: {email: createdMember.email}});
                }).then(done, done.fail);
            });
        });

        describe('when validation fails', () => {
            it('responds with status 400',(done) => {
                validateMemberStub.returns(['firstName']);
                register(goodRequest, res);

                expect(memberService.createMember).not.toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(400);
                done();
            });
        });
    });

    describe('list', () => {
        let serviceStub, req, res;

        beforeEach(() => {
            req = {user: {banchId: 'some-id-1'}};
            serviceStub = sinon.stub(memberService, 'list');
        });

        afterEach(() => {
            memberService.list.restore();
        });

        it('should return a list of members', (done) => {
            serviceStub.returns(Q.resolve([{id: 'id1', firstName: 'Pepe', lastName: 'Perez'}]));
            res = {status: sinon.stub().returns({json: sinon.spy()})};

            membersController.list(req, res)
            .then(() => {
                expect(serviceStub).toHaveBeenCalled();
                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.status().json).toHaveBeenCalledWith(jasmine.objectContaining({ members: [{id: 'id1', firstName: 'Pepe', lastName: 'Perez'}]}));
            })
            .then(done, done.fail);
        });

        describe('oops, things are not working quite well', () => {

            it('should handle service exceptions', (done) => {
                serviceStub.returns(Q.reject('Some service list error'));
                res = {sendStatus: sinon.spy()};

                membersController.list(req, res)
                .then(() => {
                    expect(res.sendStatus).toHaveBeenCalledWith(500);
                    expect(serviceStub).toHaveBeenCalled();
                })
                .then(done, done.fail);
            });

            it('should handle when a session is not found', (done) => {
                req = {};
                res = {sendStatus: sinon.spy()};

                membersController.list(req, res);
                expect(res.sendStatus).toHaveBeenCalledWith(500);
                expect(serviceStub).not.toHaveBeenCalled();
                done();
            });
        });
    });
});
