'use strict';

const streamClient = require('../../../src/streamClient');
const groupsController = require('../../../src/controllers/groupsController');
const branchService = require('../../../src/services/branchService');
const validator = require('../../../src/lib/inputValidator');
const reducers = require('../../../src/reducers/rootReducer');

describe('groupsController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(streamClient, 'publish');
    sandbox.stub(branchService, 'findById').resolves({ id: 'some-id-1' });
    sandbox.stub(validator, 'isValidUUID').returns(true);
    sandbox.stub(reducers, 'getGroups');
    res = {
      json: sandbox.spy(),
      sendStatus: sandbox.spy(),
    };
    res.status = sandbox.stub().returns(res);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createGroup', () => {
    it('puts an event on the stream and succeeds when everything is valid', () => {
      const req = {
        params: { branchId: 'some-branch-id' },
        body: { name: 'some-name', description: 'some-description' },
      };

      streamClient.publish.resolves();

      return groupsController.createGroup(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200);
          const resJson = res.json.args[0][0];
          expect(resJson.id).to.be.a('string');
          expect(resJson.branchId).to.eql('some-branch-id');
          expect(resJson.name).to.eql('some-name');
          expect(resJson.description).to.eql('some-description');

          const [eventType, eventData] = streamClient.publish.args[0];
          expect(eventType).to.eql('group-created');
          expect(eventData).to.eql(resJson);
        });
    });

    it('fails when the group name is invalid', () => {
      const req = {
        params: { branchId: 'some-branch-id' },
        body: { name: null, description: 'some-description' },
      };

      groupsController.createGroup(req, res);

      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the group description is invalid', () => {
      const req = {
        params: { branchId: 'some-branch-id' },
        body: { name: 'some-name', description: null },
      };

      groupsController.createGroup(req, res);

      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the given branch does not exist', () => {
      const req = {
        params: { branchId: 'noooope' },
        body: { name: 'some-name', description: 'some-description' },
      };

      branchService.findById.resolves({});

      return groupsController.createGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(400);
        });
    });

    it('fails when the stream operation blows up', () => {
      const req = {
        params: { branchId: 'noooope' },
        body: { name: 'some-name', description: 'some-description' },
      };

      streamClient.publish.rejects('Bummer');

      return groupsController.createGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });
  });

  describe('deleteGroup', () => {
    it('puts an event on the stream and succeeds when the group succeeds', () => {
      const req = { params: { branchId: 'some-branch', groupId: 'some-group' } };

      streamClient.publish.resolves();

      return groupsController.deleteGroup(req, res)
        .then(() => {
          expect(streamClient.publish).to.have.been.calledWith('group-removed', { id: 'some-group' });
          expect(res.sendStatus).to.have.been.calledWith(200);
        });
    });

    it('fails when the given branch does not exist', () => {
      const req = { params: { branchId: 'noooope', groupId: 'some-group' } };

      branchService.findById.resolves({});

      return groupsController.deleteGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(404);
        });
    });

    it('fails when the given group does not exist');
    it('fails when the given branch and group do not match');

    it('fails when the stream operation blows up', () => {
      const req = { params: { branchId: 'some-branch', groupId: 'some-group' } };

      streamClient.publish.rejects('Bummer');

      return groupsController.deleteGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });
  });

  describe('updateGroup', () => {
    it('puts an event on the stream and succeeds when everything is valid', () => {
      const req = {
        params: { branchId: 'some-branch-id', groupId: 'some-group-id' },
        body: { name: 'new-name', description: 'new-description' },
      };

      streamClient.publish.resolves();

      return groupsController.updateGroup(req, res)
        .then(() => {
          const newGroupData = {
            id: 'some-group-id',
            branchId: 'some-branch-id',
            name: 'new-name',
            description: 'new-description',
          };
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledWith(newGroupData);

          const [eventType, eventData] = streamClient.publish.args[0];
          expect(eventType).to.eql('group-edited');
          expect(eventData).to.eql(newGroupData);
        });
    });

    it('fails when the group name is invalid', () => {
      const req = {
        params: { branchId: 'some-branch-id', groupId: 'some-group-id' },
        body: { name: null, description: 'some-description' },
      };

      groupsController.updateGroup(req, res);

      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the group description is invalid', () => {
      const req = {
        params: { branchId: 'some-branch-id', groupId: 'some-group-id' },
        body: { name: 'some-name', description: null },
      };

      groupsController.updateGroup(req, res);

      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the stream operation blows up', () => {
      const req = {
        params: { branchId: 'some-branch-id', groupId: 'some-group-id' },
        body: { name: 'new-name', description: 'new-description' },
      };

      streamClient.publish.rejects('Bummer');

      return groupsController.updateGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });

    it('fails when the given branch does not exist', () => {
      const req = {
        params: { branchId: 'noooope', groupId: 'some-group' },
        body: { name: 'new-name', description: 'new-description' },
      };

      branchService.findById.resolves({});

      return groupsController.updateGroup(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(404);
        });
    });

    it('fails when the given group does not exist');
    it('fails when the given branch and group do not match');
  });

  describe('getBranchGroups', () => {
    it('gets all the groups for the given branch', () => {
      const req = { params: { branchId: 'some-branch-id' } };
      reducers.getGroups.returns([
        { id: '1', name: 'First', branchId: 'some-branch-id' },
        { id: '2', name: 'Second', branchId: 'some-other-id' },
        { id: '3', name: 'Third', branchId: 'some-branch-id' },
      ]);

      groupsController.getBranchGroups(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        groups: [
          { id: '1', name: 'First', branchId: 'some-branch-id' },
          { id: '3', name: 'Third', branchId: 'some-branch-id' },
        ],
      });
    });

    it('gives a 404 when the branch does not exist');
  });
});
