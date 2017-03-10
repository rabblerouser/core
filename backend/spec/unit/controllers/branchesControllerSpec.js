'use strict';

const branchService = require('../../../src/services/branchService');
const branchValidator = require('../../../src/lib/branchValidator');
const branchesController = require('../../../src/controllers/branchesController');
const streamClient = require('../../../src/streamClient');

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

const FAKE_BRANCH = {
  id: 'some-id-1',
  name: 'Geelong',
};

describe('branchesController', () => {
  let sandbox;
  let res;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sandbox.stub(streamClient, 'publish').resolves();
    res = {
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
        expect(res.status).to.have.been.calledWith(500);
      });
    });
  });

  describe('update', () => {
    let req;

    context('when branch id and admin id are valid', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = {
          params: { branchId: 1 },
          body: { id: 1, name: 'some name' },
        };
        sinon.stub(branchValidator, 'isValid').returns([]);
        sinon.stub(branchService, 'update').withArgs(req.params.id);
      });

      afterEach(() => {
        branchService.update.restore();
        branchValidator.isValid.restore();
      });

      it('responds with successful update', done => {
        branchService.update.returns(Promise.resolve(FAKE_BRANCH));
        branchesController.updateBranch(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status().json).to.have.been.calledWith(FAKE_BRANCH);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });

    // In body?
    context('when branch id is undefined', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = {
          params: { id: 'some-key' },
          body: {
            id: 'some-key',
            email: 'some-email',
            name: 'some name',
            phone: 'some phone',
          },
        };
      });

      it('should return a 400', () => {
        branchesController.updateBranch(req, res);
        expect(res.status).to.have.been.calledWith(400);
      });
    });

    // In params?
    context('when branch id is undefined', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = {
          params: {},
          body: {
            id: 'some-key',
            email: 'some-email',
            name: 'some name',
            phone: 'some phone',
          },
        };
      });

      it('should return a 400', () => {
        branchesController.updateBranch(req, res);
        expect(res.status).to.have.been.calledWith(400);
      });
    });

    context('when branch id doesn\'t match the one in the payload', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = {
          params: { branchId: 'some-other-key' },
          body: {
            id: 'some-key',
            email: 'some-email',
            name: 'some name',
            phone: 'some phone',
          },
        };

        it('should return a 400', done => {
          branchesController.updateBranch(req, res)
            .then(() => {
              expect(res.status).to.have.been.calledWith(400);
            })
            .then(done, done.fail)
            .catch(done);
        });
      });
    });

    context('when the payload provided is invalid', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = {
          params: { branchId: 1 },
          body: {
            email: 'some phone',
          },
        };
        sinon.stub(branchValidator, 'isValid').returns(['email']);
      });

      afterEach(() => {
        branchValidator.isValid.restore();
      });

      it('should return a 400', () => {
        branchesController.updateBranch(req, res);
        expect(res.status).to.have.been.calledWith(400);
      });
    });

    context('when there is a general error from the service', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = {
          params: { branchId: 'some-key' },
          body: {
            id: 'some-key',
            name: 'some name',
          },
        };
        sinon.stub(branchValidator, 'isValid').returns([]);
        sinon.stub(branchService, 'update').withArgs(req.params.id);
      });

      afterEach(() => {
        branchService.update.restore();
        branchValidator.isValid.restore();
      });

      it('should return a 500', done => {
        branchService.update.returns(Promise.reject('anything at all'));
        branchesController.updateBranch(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(500);
          })
          .then(done, done.fail)
          .catch(done);
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
