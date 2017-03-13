'use strict';

const memberValidator = require('../../../src/lib/memberValidator');
const membersController = require('../../../src/controllers/membersController');
const inputValidator = require('../../../src/lib/inputValidator');
const csvGenerator = require('../../../src/lib/csvGenerator');
const branchService = require('../../../src/services/branchService');
const groupService = require('../../../src/services/groupService');
const streamClient = require('../../../src/streamClient');
const store = require('../../../src/store');
const reducers = require('../../../src/reducers/rootReducer');

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
    sandbox.stub(store, 'getState');
    sandbox.stub(reducers, 'getMembers');
    sandbox.stub(csvGenerator, 'generateCsv');
    sandbox.stub(inputValidator, 'isValidUUID');
    sandbox.stub(branchService, 'findById');
    sandbox.stub(groupService, 'list');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('registerMember', () => {
    it('parses a valid member, and publishes an event to the stream', () => {
      const address = { address: '47 Spam St', suburb: 'Moriarty', country: 'USA', state: 'NM', postcode: '5678' };
      const validBody = {
        name: 'Sherlock Holmes',
        email: 'sherlock@holmes.co.uk',
        phoneNumber: '0396291146',
        address,
        branchId: 'some-id-1',
        additionalInfo: null,
      };

      const req = { body: validBody };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));
      streamClient.publish.returns(Promise.resolve());

      return membersController.registerMember(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.status().json).to.have.been.calledWith({});
        const [eventType, eventData] = streamClient.publish.args[0];
        expect(eventType).to.eql('member-registered');
        expect(eventData.additionalInfo).to.eql(null);
        expect(eventData.branchId).to.eql('some-id-1');
        expect(eventData.email).to.eql('sherlock@holmes.co.uk');
        expect(eventData.name).to.eql('Sherlock Holmes');
        expect(eventData.id).to.be.a('string');
        expect(eventData.memberSince).to.be.an('object');
        expect(eventData.address).to.eql({ address: '47 Spam St', country: 'USA', postcode: '5678', state: 'NM', suburb: 'Moriarty' });
        expect(eventData.phoneNumber).to.eql('0396291146');
      });
    });

    it('sends a 500 back if the stream publish fails', () => {
      const req = { body: {} };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));
      streamClient.publish.returns(Promise.reject('oh noes!'));

      return membersController.registerMember(req, res).then(() => {
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });

    it('sends a 400 back if the request is invalid', () => {
      const req = { body: {} };
      memberValidator.isValid.returns(['error!']);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));

      return membersController.registerMember(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(400);
        expect(res.status().json).to.have.been.calledWith({ errors: ['error!'] });
      });
    });

    it('send a 400 back if the request is mostly valid except for the branch id', () => {
      const req = {
        body: {
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'non-existent-branch',
        },
      };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({}));

      return membersController.registerMember(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(400);
          expect(res.status().json).to.have.been.calledWith({ errors: ['Unknown branchId'] });
        });
    });
  });

  describe('editMember', () => {
    beforeEach(() => {
      groupService.list.returns([
        { id: 'first' },
        { id: 'second' },
      ]);
    });

    it('parses a valid member, and publishes an event to the stream', () => {
      const address = { address: '47 Spam St', suburb: 'Moriarty', country: 'USA', state: 'NM', postcode: '5678' };
      const validBody = {
        name: 'Sherlock Holmes',
        email: 'sherlock@holmes.co.uk',
        phoneNumber: '0396291146',
        address,
        branchId: 'some-id-1',
        additionalInfo: null,
        notes: 'Some notes',
        id: 'abc-123',
        groups: ['first', 'second'],
      };

      const req = { body: validBody };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));
      streamClient.publish.returns(Promise.resolve());

      return membersController.editMember(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.status().json).to.have.been.calledWith({});
        expect(streamClient.publish).to.have.been.calledWith(
          'member-edited',
          {
            additionalInfo: null,
            branchId: 'some-id-1',
            email: 'sherlock@holmes.co.uk',
            name: 'Sherlock Holmes',
            notes: 'Some notes',
            id: 'abc-123',
            groups: ['first', 'second'],
            address: { address: '47 Spam St', country: 'USA', postcode: '5678', state: 'NM', suburb: 'Moriarty' },
            phoneNumber: '0396291146',
          }
        );
      });
    });

    it('sends a 500 back if the stream publish fails', () => {
      const req = { body: { id: 'hello' } };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));
      streamClient.publish.returns(Promise.reject('oh noes!'));

      return membersController.editMember(req, res).then(() => {
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });

    it('sends a 400 back if the request is invalid', () => {
      const req = { body: {} };
      memberValidator.isValid.returns(['error!']);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));

      return membersController.editMember(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(400);
          expect(res.status().json).to.have.been.calledWith({ errors: ['error!'] });
        });
    });

    it('sends a 400 back if the request is mostly valid except for the branch id', () => {
      const req = {
        body: {
          id: 'abc-123',
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'non-existent-branch',
          groups: ['first', 'second'],
        },
      };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({}));

      return membersController.editMember(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(400);
          expect(res.status().json).to.have.been.calledWith({ errors: ['Unknown branchId'] });
        });
    });

    it('send a 400 back if the request is mostly valid except for one of the group IDs', () => {
      const req = {
        body: {
          id: 'abc-123',
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'non-existent-branch',
          groups: ['first', 'second', 'third'],
        },
      };
      memberValidator.isValid.returns([]);
      branchService.findById.returns(Promise.resolve({ id: 'some-id-1' }));

      return membersController.editMember(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(400);
          expect(res.status().json).to.have.been.calledWith({ errors: ['Unknown groupId third'] });
        });
    });
  });

  describe('listBranchMembers', () => {
    it('returns no members if no branchId is given', () => {
      const req = { params: {} };
      membersController.listBranchMembers(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        members: [],
      });
    });

    it('returns only the members from the branch', () => {
      const req = { params: { branchId: 'right' } };
      reducers.getMembers.returns([
        { name: 'John Doe', branchId: 'right' },
        { name: 'Jess Doe', branchId: 'wrong' },
      ]);

      membersController.listBranchMembers(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith({
        members: [{ name: 'John Doe', branchId: 'right' }],
      });
    });
  });

  describe('exportBranchMembers', () => {
    it('gets the relevant members and transforms them to CSV', () => {
      const req = { params: { branchId: 'right' } };
      res = { set: () => {}, send: sinon.spy() };
      const members = [
        { name: 'member-1', branchId: 'right' },
        { name: 'member-2', branchId: 'right' },
        { name: 'member-3', branchId: 'wrong' },
      ];
      const csv = 'member1\nmember2';
      reducers.getMembers.returns(members);
      csvGenerator.generateCsv.returns(csv);

      membersController.exportBranchMembers(req, res);

      expect(csvGenerator.generateCsv).to.have.been.calledWith(
        sinon.match.array,
        [{ name: 'member-1', branchId: 'right' }, { name: 'member-2', branchId: 'right' }]
      );
      expect(res.send).to.have.been.calledWith(csv);
    });
  });

  describe('deleteMember', () => {
    it('gives a 400 when the memberId is not valid', () => {
      inputValidator.isValidUUID.returns(false);

      membersController.deleteMember({ params: { memberId: 'bad' } }, res);
      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('publishes an event and gives a 200 when it succeeds', () => {
      inputValidator.isValidUUID.returns(true);
      streamClient.publish.returns(Promise.resolve());

      return membersController.deleteMember({ params: { memberId: '12345' } }, res).then(() => {
        expect(streamClient.publish).to.have.been.calledWith('member-removed', { id: '12345' });
        expect(res.sendStatus).to.have.been.calledWith(200);
      });
    });

    it('publishes an event and gives a 500 when it fails', () => {
      inputValidator.isValidUUID.returns(true);
      streamClient.publish.returns(Promise.reject('Oops'));

      return membersController.deleteMember({ params: { memberId: '12345' } }, res).then(() => {
        expect(streamClient.publish).to.have.been.calledWith('member-removed', { id: '12345' });
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });
  });
});
