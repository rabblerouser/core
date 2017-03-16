'use strict';

const memberValidator = require('../../../src/lib/memberValidator');
const membersController = require('../../../src/controllers/membersController');
const inputValidator = require('../../../src/lib/inputValidator');
const csvGenerator = require('../../../src/lib/csvGenerator');
const streamClient = require('../../../src/streamClient');
const store = require('../../../src/store');

describe('membersController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    res = {
      json: sandbox.spy(),
      sendStatus: sandbox.stub(),
    };
    res.status = sandbox.stub().returns(res);
    sandbox.stub(memberValidator, 'isValid').returns([]);
    sandbox.stub(streamClient, 'publish').resolves();
    sandbox.stub(store, 'getMembers');
    sandbox.stub(store, 'getGroups');
    sandbox.stub(store, 'getBranches').returns([{ id: 'some-id-1' }]);
    sandbox.stub(csvGenerator, 'generateCsv');
    sandbox.stub(inputValidator, 'isValidUUID');
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

      return membersController.registerMember(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({});
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
      const req = { body: { branchId: 'some-id-1' } };
      streamClient.publish.rejects('oh noes!');

      return membersController.registerMember(req, res).then(() => {
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });

    it('sends a 400 back if the request is invalid', () => {
      const req = { body: { branchId: 'some-id-1' } };
      memberValidator.isValid.returns(['error!']);

      membersController.registerMember(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['error!'] });
    });

    it('sends a 400 back if the request is mostly valid except for the branch id', () => {
      const req = {
        body: {
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'non-existent-branch',
        },
      };

      membersController.registerMember(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['Unknown branchId'] });
    });
  });

  describe('editMember', () => {
    beforeEach(() => {
      store.getGroups.returns([
        { id: 'first', branchId: 'some-id-1' },
        { id: 'second', branchId: 'some-id-1' },
        { id: 'other', branchId: 'some-other-branch' },
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
        id: 'member-1',
        groups: ['first', 'second'],
      };

      const req = { body: validBody };

      return membersController.editMember(req, res).then(() => {
        expect(res.status).to.have.been.calledWith(201);
        expect(res.json).to.have.been.calledWith({});
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
      const req = { body: { id: 'member-1', branchId: 'some-id-1' } };

      streamClient.publish.rejects('oh noes!');

      return membersController.editMember(req, res).then(() => {
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });

    it('sends a 400 back if the request is invalid', () => {
      const req = { body: { branchId: 'some-id-1' } };
      memberValidator.isValid.returns(['error!']);

      membersController.editMember(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['error!'] });
    });

    it('sends a 400 back if the request is mostly valid except for the branch id', () => {
      const req = {
        body: {
          id: 'abc-123',
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'non-existent-branch',
          groups: [],
        },
      };

      membersController.editMember(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['Unknown branchId'] });
    });

    it('sends a 400 back if one of the given groups does not exist', () => {
      const req = {
        body: {
          id: 'abc-123',
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'some-id-1',
          groups: ['first', 'second', 'third'],
        },
      };

      membersController.editMember(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['Unknown groupId third'] });
    });

    it('sends a 400 back if one of the given groups is from a different branch', () => {
      const req = {
        body: {
          id: 'abc-123',
          name: 'Sherlock Holmes',
          email: 'sherlock@holmes.co.uk',
          branchId: 'some-id-1',
          groups: ['first', 'second', 'other'],
        },
      };

      membersController.editMember(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['Unknown groupId other'] });
    });
  });

  describe('listBranchMembers', () => {
    it('sends a 404 back if the given branch does not exist', () => {
      const req = { params: { branchId: 'non-existent-branch' } };
      membersController.listBranchMembers(req, res);

      expect(res.sendStatus).to.have.been.calledWith(404);
    });

    it('returns only the members from the branch', () => {
      const req = { params: { branchId: 'some-id-1' } };
      store.getMembers.returns([
        { name: 'John Doe', branchId: 'some-id-1' },
        { name: 'Jess Doe', branchId: 'some-id-2' },
      ]);

      membersController.listBranchMembers(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        members: [{ name: 'John Doe', branchId: 'some-id-1' }],
      });
    });
  });

  describe('exportBranchMembers', () => {
    it('sends a 404 back if the given branch does not exist', () => {
      const req = { params: { branchId: 'non-existent-branch' } };
      membersController.exportBranchMembers(req, res);

      expect(res.sendStatus).to.have.been.calledWith(404);
    });

    it('gets the relevant members and transforms them to CSV', () => {
      const req = { params: { branchId: 'some-id-1' } };
      res = { set: () => {}, send: sinon.spy() };
      const members = [
        { name: 'member-1', branchId: 'some-id-1' },
        { name: 'member-2', branchId: 'some-id-1' },
        { name: 'member-3', branchId: 'some-id-2' },
      ];
      const csv = 'member1\nmember2';
      store.getMembers.returns(members);
      csvGenerator.generateCsv.returns(csv);

      membersController.exportBranchMembers(req, res);

      expect(csvGenerator.generateCsv).to.have.been.calledWith(
        sinon.match.array,
        [{ name: 'member-1', branchId: 'some-id-1' }, { name: 'member-2', branchId: 'some-id-1' }]
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
