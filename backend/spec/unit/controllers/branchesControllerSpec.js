'use strict';

const branchService = require('../../../src/services/branchService');
const branchesController = require('../../../src/controllers/branchesController');
const streamClient = require('../../../src/streamClient');
const reducers = require('../../../src/reducers/rootReducer');

const FAKE_BRANCHES_LIST = [
  {
    id: 'some-id-1',
    name: 'Geelong',
  },
  {
    id: 'some-id-2',
    name: 'Frankston',
  },
  {
    id: 'some-id-3',
    name: 'Hawthorn',
  },
];

describe('branchesController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(streamClient, 'publish').resolves();
    sandbox.stub(reducers, 'getMembers').returns([{ id: 'irrelevant-member', branchId: 'some-other-branch' }]);
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
      const req = { params: { branchId: 'some-branch' } };

      return branchesController.deleteBranch(req, res)
        .then(() => {
          expect(streamClient.publish).to.have.been.calledWith('branch-removed', { id: 'some-branch' });
          expect(res.sendStatus).to.have.been.calledWith(200);
        });
    });

    it('fails when the branch does not exist');

    it('fails when the branch still has members', () => {
      const req = { params: { branchId: 'some-branch' } };
      reducers.getMembers.returns([{ id: 'some-member', branchId: 'some-branch' }]);

      branchesController.deleteBranch(req, res);
      expect(res.sendStatus).to.have.been.calledWith(400);
    });

    it('fails when the stream client blows up', () => {
      const req = { params: { branchId: 'some-branch' } };

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
        params: { branchId: 'some-branch' },
        body: { name: 'New name', notes: 'New notes', contact: 'New contact' },
      };

      return branchesController.updateBranch(req, res)
        .then(() => {
          const updatedBranch = {
            id: 'some-branch',
            name: 'New name',
            notes: 'New notes',
            contact: 'New contact',
          };
          expect(streamClient.publish).to.have.been.calledWith('branch-edited', updatedBranch);
          expect(res.status).to.have.been.calledWith(200);
          expect(res.json).to.have.been.calledWith(updatedBranch);
        });
    });

    it('fails when the branch does not exist');

    it('fails when the branch name is empty', () => {
      const req = {
        params: { branchId: 'some-branch' },
        body: { name: '', notes: 'New notes', contact: 'New contact' },
      };

      branchesController.updateBranch(req, res);

      expect(res.status).to.have.been.calledWith(400);
      expect(res.json).to.have.been.calledWith({ errors: ['name'] });
    });

    it('fails when the stream client blows up', () => {
      const req = {
        params: { branchId: 'some-branch' },
        body: { name: 'New name', notes: 'New notes', contact: 'New contact' },
      };
      streamClient.publish.rejects();

      return branchesController.updateBranch(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
        });
    });
  });

  describe('list', () => {
    let req;

    beforeEach(() => {
      sinon.stub(branchService, 'list');
      res = { status: sinon.stub().returns({ json: sinon.spy() }) };
    });

    afterEach(() => {
      branchService.list.restore();
    });

    it('responds with a list of branches', done => {
      branchService.list.returns(Promise.resolve(FAKE_BRANCHES_LIST));

      branchesController.listBranches(req, res)
        .then(() => {
          expect(branchService.list).to.have.been.calledWith(['id', 'name']);
          expect(res.status).to.have.been.calledWith(200);
          expect(res.status().json).to.have.been.calledWith({ branches: FAKE_BRANCHES_LIST });
        })
        .then(done, done.fail)
        .catch(done);
    });

    describe('things went bad', () => {
      it('should return 500 when there is an unexpected error', done => {
        res = { sendStatus: sinon.spy() };
        branchService.list.returns(Promise.reject('some service error'));

        branchesController.listBranches(req, res)
          .then(() => {
            expect(res.sendStatus).to.have.been.calledWith(500);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });
  });

  describe('branchesForAdmin', () => {
    context('when things did not go well', () => {
      beforeEach(() => {
        sinon.stub(branchService, 'findById');
      });

      afterEach(() => {
        branchService.findById.restore();
      });

      it('should handle errors from the service', done => {
        branchService.findById.returns(Promise.reject('some service error'));
        res = { sendStatus: sinon.spy() };

        const req = { user: { type: 'normal', branchId: '1' } };
        branchesController.branchesForAdmin(req, res)
          .then(() => {
            expect(res.sendStatus).to.have.been.calledWith(500);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });
  });
});
