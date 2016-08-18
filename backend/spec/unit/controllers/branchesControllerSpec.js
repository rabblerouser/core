'use strict';

const branchService = require('../../../src/services/branchService');
const branchValidator = require('../../../src/lib/branchValidator');
const branchesController = require('../../../src/controllers/branchesController');

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

const FAKE_GROUPS_LIST = [
  {
    id: 'some-key',
    name: 'some group name',
    description: 'some description',
  },
  {
    id: 'some-key2',
    name: 'some group name2',
    description: 'some description2',
  },
];

const FAKE_EMPTY_GROUPS_LIST = [];

describe('branchesController', () => {
  describe('create', () => {
    let req;
    let res;

    context('when the payload is valid', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = { body: { name: 'some-name' } };
        sinon.stub(branchValidator, 'isValid').returns([]);
        sinon.stub(branchService, 'create');
      });

      afterEach(() => {
        branchService.create.restore();
        branchValidator.isValid.restore();
      });

      it('responds with successful update', done => {
        branchService.create.returns(Promise.resolve(FAKE_BRANCH));
        branchesController.create(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status().json).to.have.been.calledWith(FAKE_BRANCH);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });

    context('when the payload provided is invalid', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = { body: { name: 'invalid' } };
        sinon.stub(branchValidator, 'isValid').returns(['name']);
      });

      afterEach(() => {
        branchValidator.isValid.restore();
      });

      it('should return a 400', () => {
        branchesController.create(req, res);
        expect(res.status).to.have.been.calledWith(400);
      });
    });

    context('when there is a general error from the service', () => {
      beforeEach(() => {
        res = { status: sinon.stub().returns({ json: sinon.spy() }) };
        req = { body: { name: 'some name' } };
        sinon.stub(branchValidator, 'isValid').returns([]);
        sinon.stub(branchService, 'create');
      });

      afterEach(() => {
        branchService.create.restore();
        branchValidator.isValid.restore();
      });

      it('should return a 500', done => {
        branchService.create.returns(Promise.reject('anything at all'));
        branchesController.create(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(500);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });
  });

  describe('update', () => {
    let req;
    let res;

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
        branchesController.update(req, res)
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
        branchesController.update(req, res);
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
        branchesController.update(req, res);
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
          branchesController.update(req, res)
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
        branchesController.update(req, res);
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
        branchesController.update(req, res)
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
    let res;

    beforeEach(() => {
      sinon.stub(branchService, 'list');
      res = { status: sinon.stub().returns({ json: sinon.spy() }) };
    });

    afterEach(() => {
      branchService.list.restore();
    });

    it('responds with a list of branches', done => {
      branchService.list.returns(Promise.resolve(FAKE_BRANCHES_LIST));

      branchesController.list(req, res)
        .then(() => {
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

        branchesController.list(req, res)
          .then(() => {
            expect(res.sendStatus).to.have.been.calledWith(500);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });
  });

  describe('groupsInBranch', () => {
    let req;
    let res;

    beforeEach(() => {
      res = { status: sinon.stub().returns({ json: sinon.spy() }) };
      req = { params: { id: 1 } };
      sinon.stub(branchService, 'groupsInBranch').withArgs(req.params.id);
    });

    afterEach(() => {
      branchService.groupsInBranch.restore();
    });

    context('when the branch id is valid and has groups', () => {
      beforeEach(() => {
        branchService.groupsInBranch.returns(Promise.resolve(FAKE_GROUPS_LIST));
      });

      it('responds with a list of groups', done => {
        branchesController.groupsByBranch(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status().json).to.have.been.calledWith({ groups: FAKE_GROUPS_LIST });
          })
          .then(done, done.fail)
          .catch(done);
      });
    });

    context('when the branch id is valid and has no groups', () => {
      beforeEach(() => {
        branchService.groupsInBranch.returns(Promise.resolve(FAKE_EMPTY_GROUPS_LIST));
      });

      it('responds with an empty list of groups', done => {
        branchesController.groupsByBranch(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(200);
            expect(res.status().json).to.have.been.calledWith({ groups: FAKE_EMPTY_GROUPS_LIST });
          }).then(done, done.fail);
      });
    });

    context('when the branch id is invalid', () => {
      it('should return a 400', done => {
        branchService.groupsInBranch.returns(Promise.reject('invalid branch id'));

        branchesController.groupsByBranch(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(400);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });

    context('when there is a general error from the service', () => {
      it('should return a 500', done => {
        branchService.groupsInBranch.returns(Promise.reject('anything at all'));

        branchesController.groupsByBranch(req, res)
          .then(() => {
            expect(res.status).to.have.been.calledWith(500);
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
        const res = { sendStatus: sinon.spy() };

        branchesController.list({}, res)
          .then(() => {
            expect(res.sendStatus).to.have.been.calledWith(500);
          })
          .then(done, done.fail)
          .catch(done);
      });
    });
  });
});
