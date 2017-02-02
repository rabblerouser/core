'use strict';

const Q = require('q');
const memberService = require('../../../src/services/memberService');
const memberValidator = require('../../../src/lib/memberValidator');
const messagingService = require('../../../src/services/messagingService');
const membersController = require('../../../src/controllers/membersController');
const inputValidator = require('../../../src/lib/inputValidator');
const csvGenerator = require('../../../src/lib/csvGenerator');
const streamClient = require('../../../src/streamClient');

describe('membersController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    res = {
      status: sandbox.stub().returns({ json: sandbox.spy() }),
      sendStatus: sandbox.stub(),
    };
    sandbox.stub(memberValidator, 'isValid');
    sandbox.stub(streamClient, 'publish');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('register', () => {
    it('parses a valid member, and publishes an event to the stream', () => {
      const residentialAddress = { address: '221b Baker St', suburb: 'London', country: 'England', state: 'VIC', postcode: '1234' };
      const postalAddress = { address: '47 I dont want your spam St', suburb: 'Moriarty', country: 'USA', state: 'NM', postcode: '5678' };
      const validBody = {
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
        notes: null,
        id: null,
        groups: null
      };

      const req = { body: validBody };
      memberValidator.isValid.returns([]);
      streamClient.publish.returns(Promise.resolve());

      return membersController.register(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.status().json).to.have.been.calledWith({});
        expect(streamClient.publish).to.have.been.calledWith({
          type: 'member-registered',
          data: {
            additionalInfo: null,
            branchId: "some-id-1",
            email: "sherlock@holmes.co.uk",
            firstName: "Sherlock",
            gender: "detective genius",
            groups: null,
            id: null,
            lastName: "Holmes",
            membershipType: "full",
            notes: null,
            postalAddress: { address: "47 I dont want your spam St", country: "USA", postcode: "5678", state: "NM", suburb: "Moriarty" },
            primaryPhoneNumber: "0396291146",
            residentialAddress: { address: "221b Baker St", country: "England", postcode: "1234", state: "VIC", suburb: "London" },
            secondaryPhoneNumber: "0394291146"
          }
        });
      });
    });

    it('sends a 500 back if the stream publish fails', () => {
      const req = { body: {} };
      memberValidator.isValid.returns([]);
      streamClient.publish.returns(Promise.reject());

      return membersController.register(req, res).then(() => {
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });

    it('sends a 400 back if the request is invalid', () => {
      const req = { body: {} };
      memberValidator.isValid.returns(['error!']);

      membersController.register(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.status().json).to.have.been.calledWith({ errors: ['error!'] });
    });
  });

  describe('putMemberInDatabase', () => {
    it('puts the member in the database', () => {
      sandbox.stub(memberService, 'createMember').returns('DB result');

      const result = membersController.putMemberInDatabase("I'm a member");

      expect(result).to.eql('DB result');
      expect(memberService.createMember).to.have.been.calledWith("I'm a member");
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
