'use strict';

const Q = require('q');
const memberService = require('../../../src/services/memberService');
const memberValidator = require('../../../src/lib/memberValidator');
const messagingService = require('../../../src/services/messagingService');
const membersController = require('../../../src/controllers/membersController');
const inputValidator = require('../../../src/lib/inputValidator');
const csvGenerator = require('../../../src/lib/csvGenerator');

describe('membersController', () => {

    describe('register', () => {
        let register,
            goodRequest, res,
            residentialAddress, postalAddress,
            createMemberStub, createMemberPromise,
            validateMemberStub, sendWelcomeEmailPromise,
            sendWelcomeEmailStub;

        beforeEach(() => {
            register = membersController.register;
            createMemberStub = sinon.stub(memberService, 'createMember');
            validateMemberStub = sinon.stub(memberValidator, 'isValid');
            sendWelcomeEmailStub = sinon.stub(messagingService, 'sendWelcomeEmail');
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
                    primaryPhoneNumber: '0396291146',
                    secondaryPhoneNumber: '0394291146',
                    residentialAddress: residentialAddress,
                    postalAddress: postalAddress,
                    membershipType: 'full',
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

            sendWelcomeEmailPromise = Q.defer();
            sendWelcomeEmailStub
                .returns(sendWelcomeEmailPromise.promise);
        });

        afterEach(() => {
            memberService.createMember.restore();
            memberValidator.isValid.restore();
            messagingService.sendWelcomeEmail.restore();
        });

        describe('when it receives a good request', () => {
            let createdMember = {id:'1234', membershipType: 'full', email: 'sherlock@holmes.co.uk'};

            beforeEach(() => {
                validateMemberStub.returns([]);
                createMemberPromise.resolve(createdMember);
                sendWelcomeEmailPromise.resolve({options:{}, result: {accepeted: ['sherlock@holmes.co.uk'], rejected: []} });
            });

            it('creates a new member', () => {
                return register(goodRequest, res)
                .then(() => {
                    expect(res.status).to.have.been.calledWith(200);
                    expect(res.status().json).to.have.been.calledWith({newMember: {email: createdMember.email}});
                });
            });

            it('should send an email to the member after new member is created', () => {
                return register(goodRequest, res)
                .then(() => {
                    expect(sendWelcomeEmailStub).to.have.been.calledWith({
                        id:'1234',
                        membershipType: 'full',
                        email: 'sherlock@holmes.co.uk'
                    });
                });

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

  describe('exportBranchMembers', () => {
    it('gets the members transforms them to CSV', () => {
      const req = { params: { branchId: 'some-id-1' } };
      const res = { set: () => {}, send: sinon.spy() };
      const members = [{ name: 'member-1' }, { name: 'member-2' }];
      const csv = 'member1\nmember2';

      sinon.stub(memberService, 'list').returns(Q.resolve(members));
      const csvStub = sinon.stub(csvGenerator, 'generateCsv').returns(csv);

      return membersController.exportBranchMembers(req, res).then(() => {
        expect(csvStub).to.have.been.calledWith(sinon.match.array, members);
        expect(res.send).to.have.been.calledWith(csv);

        memberService.list.restore();
        csvGenerator.generateCsv.restore();
      });
    });
  });

  describe('deleteBranch', () => {
    let res;
    let validateUUIDStub;
    let memberServiceDelete;

    beforeEach(() => {
      res = { sendStatus: sinon.spy() };
      validateUUIDStub = sinon.stub(inputValidator, 'isValidUUID');
      memberServiceDelete = sinon.stub(memberService, 'delete');
    });

    afterEach(() => {
      memberService.delete.restore();
      inputValidator.isValidUUID.restore();
    });

    it('gives a 400 when the memberId is not valid', () => {
      validateUUIDStub.returns(false);

      membersController.delete({ params: { memberId: 'bad' } }, res);
      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('calls the member service, and gives a 200 when it succeeds', () => {
      validateUUIDStub.returns(true);
      memberServiceDelete.returns(Q.resolve());

      return membersController.delete({ params: { memberId: '12345' } }, res).then(() => {
        expect(memberServiceDelete).to.have.been.calledWith('12345');
        expect(res.sendStatus).to.have.been.calledWith(200);
      });
    });

    it('calls the member service, and gives a 500 when it fails', () => {
      validateUUIDStub.returns(true);
      memberServiceDelete.returns(Q.reject());

      return membersController.delete({ params: { memberId: '12345' } }, res).then(() => {
        expect(memberServiceDelete).to.have.been.calledWith('12345');
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });
  });
});
