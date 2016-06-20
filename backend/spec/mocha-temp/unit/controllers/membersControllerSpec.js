'use strict';

const Q = require('q');
const memberService = require('../../../../src/services/memberService');
const memberValidator = require('../../../../src/lib/memberValidator');
const membersController = require('../../../../src/controllers/membersController');

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
                    branchId: 'some-id-1',
                    additionalInfo: null,
                    pastoralNotes: null,
                    id: null,
                    groups: null
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
            let createdMember = {id:'1234', membershipType: 'full', email: 'sherlock@holmes.co.uk'};

            beforeEach(() => {
                validateMemberStub.returns([]);
                createMemberPromise.resolve(createdMember);
            });

            it('creates a new member', (done) => {
                register(goodRequest, res)
                .then(() => {
                    expect(res.status).to.have.been.calledWith(200);
                    expect(res.status().json).to.have.been.calledWith({newMember: {email: createdMember.email}});
                })
                .then(done)
                .catch(done);
            });
        });

        describe('when validation fails', () => {
            it('responds with status 400',(done) => {
                validateMemberStub.returns(['firstName']);
                register(goodRequest, res);

                expect(memberService.createMember).not.to.have.been.called;
                expect(res.status).to.have.been.calledWith(400);
                done();
            });
        });
    });

    describe('list', () => {
        let serviceStub, req, res;

        beforeEach(() => {
            req = {
                params: {banchId: 'some-id-1'},
                user: {banchId: 'some-id-1'}
            };
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
                expect(serviceStub).to.have.been.called;
                expect(res.status).to.have.been.calledWith(200);
                expect(res.status().json).to.have.been.calledWith(sinon.match({
                  members: [
                    {id: 'id1', firstName: 'Pepe', lastName: 'Perez'}
                  ]
                }));
            })
            .then(done)
            .catch(done);
        });

        describe('oops, things are not working quite well', () => {

            it('should handle service exceptions', (done) => {
                serviceStub.returns(Q.reject('Some service list error'));
                res = {sendStatus: sinon.spy()};

                membersController.list(req, res)
                .then(() => {
                    expect(res.sendStatus).to.have.been.calledWith(500);
                    expect(serviceStub).to.have.been.called;
                })
                .then(done)
                .catch(done);
            });

            it('should handle when a session is not found', (done) => {
                req = {};
                res = {sendStatus: sinon.spy()};

                membersController.list(req, res);
                expect(res.sendStatus).to.have.been.calledWith(500);
                expect(serviceStub).not.to.have.been.called;
                done();
            });
        });
    });
});
