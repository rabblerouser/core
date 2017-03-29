'use strict';

const branchesController = require('../../../src/controllers/branchesController');
const streamClient = require('../../../src/streamClient');
const store = require('../../../src/store');

describe('branchesController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(streamClient, 'publish').resolves();
    sandbox.stub(store, 'getMembers').returns([{ id: 'irrelevant-member', branchId: 'some-other-branch' }]);
    sandbox.stub(store, 'getBranches').returns([
      { id: 'branch-1', name: 'Victoria', notes: 'For super admins only', contact: 'For authd users only!' },
      { id: 'branch-2', name: 'New South Wales', notes: 'For super admins only', contact: 'For authd users only!' },
    ]);
    res = {
      sendStatus: sinon.spy(),
      json: sinon.spy(),
    };
    res.status = sinon.stub().returns(res);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createBranch', () => {
    it('puts an event on the stream when the branch is valid', () => {
      const req = { body: { name: 'Main Branch', notes: 'This is a branch', contact: '9876 5432' } };

      return branchesController.createBranch(req, res)
        .then(() => {
          const [eventType, eventData] = streamClient.publish.args[0];
          expect(eventType).to.eql('branch-created');
          expect(eventData.id).to.be.a('string');
          expect(eventData.name).to.eql('Main Branch');
          expect(eventData.notes).to.eql('This is a branch');
          expect(eventData.contact).to.eql('9876 5432');

          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledWith(eventData);
        });
    });

    it('fails when the branch name is empty', () => {
      const req = { body: { name: '', notes: 'This is a branch', contact: '9876 5432' } };

      branchesController.createBranch(req, res);
      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['name'] });
    });

    it('fails when the stream client blows up', () => {
      const req = { body: { name: 'Main Branch', notes: 'This is a branch', contact: '9876 5432' } };
      streamClient.publish.rejects();

      return branchesController.createBranch(req, res).then(() => {
        expect(res.sendStatus).to.have.been.calledWith(500);
      });
    });
  });

  describe('deleteBranch', () => {
    it('puts an event on the stream when the branch exists and has no members', () => {
      const req = { params: { branchId: 'branch-1' } };

      return branchesController.deleteBranch(req, res)
        .then(() => {
          expect(streamClient.publish).to.have.been.calledWith('branch-removed', { id: 'branch-1' });
          expect(res.sendStatus).to.have.been.calledWith(200);
        });
    });

    it('fails when the branch still has members', () => {
      const req = { params: { branchId: 'branch-1' } };
      store.getMembers.returns([{ id: 'some-member', branchId: 'branch-1' }]);

      branchesController.deleteBranch(req, res);
      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the stream client blows up', () => {
      const req = { params: { branchId: 'branch-1' } };

      streamClient.publish.rejects();

      return branchesController.deleteBranch(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });
  });

  describe('updateBranch', () => {
    it('puts an event on the stream when everything is valid', () => {
      const req = {
        params: { branchId: 'branch-1' },
        body: { name: 'New name', notes: 'New notes', contact: 'New contact' },
      };

      return branchesController.updateBranch(req, res)
        .then(() => {
          const updatedBranch = {
            id: 'branch-1',
            name: 'New name',
            notes: 'New notes',
            contact: 'New contact',
          };
          expect(streamClient.publish).to.have.been.calledWith('branch-edited', updatedBranch);
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledWith(updatedBranch);
        });
    });

    it('fails when the branch name is empty', () => {
      const req = {
        params: { branchId: 'branch-1' },
        body: { name: '', notes: 'New notes', contact: 'New contact' },
      };

      branchesController.updateBranch(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['name'] });
    });

    it('fails when the stream client blows up', () => {
      const req = {
        params: { branchId: 'branch-1' },
        body: { name: 'New name', notes: 'New notes', contact: 'New contact' },
      };
      streamClient.publish.rejects();

      return branchesController.updateBranch(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });
  });

  describe('listBranches', () => {
    it('sends back just the branch IDs and names', () => {
      const req = {};

      branchesController.listBranches(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        branches: [
          { id: 'branch-1', name: 'Victoria' },
          { id: 'branch-2', name: 'New South Wales' },
        ],
      });
    });
  });

  describe('branchesForAdmin', () => {
    it('returns all branches for a super admin', () => {
      const req = { user: { type: 'SUPER' } };

      branchesController.branchesForAdmin(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        branches: [
          { id: 'branch-1', name: 'Victoria', notes: 'For super admins only', contact: 'For authd users only!' },
          { id: 'branch-2', name: 'New South Wales', notes: 'For super admins only', contact: 'For authd users only!' },
        ],
      });
    });

    it('returns just the one branch for a branch admin, without the notes', () => {
      const req = { user: { type: 'BRANCH', branchId: 'branch-2' } };

      branchesController.branchesForAdmin(req, res);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith({
        branches: [
          { id: 'branch-2', name: 'New South Wales', contact: 'For authd users only!' },
        ],
      });
    });
  });
});
