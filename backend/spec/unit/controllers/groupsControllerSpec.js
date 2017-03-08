'use strict';

const groupService = require('../../../src/services/groupService');
const subject = require('../../../src/controllers/groupsController');

describe('groupsController', () => {
  context('when there is an error', () => {
    let req;
    let res;

    beforeEach(() => {
      sinon.stub(groupService, 'create');
      res = { sendStatus: sinon.spy() };
    });

    afterEach(() => {
      groupService.create.restore();
    });

    it('returns 500 and an empty body', done => {
      groupService.create.returns(Promise.reject('Error when creating a group'));

      req = {
        params: { branchId: 'some-branch-id' },
        body: { name: 'some-name', description: 'some-description' },
      };

      subject.create(req, res)
        .then(() => {
          expect(res.sendStatus).to.have.been.calledWith(500);
          expect(groupService.create).to.have.been.calledWith(req.body, req.params.branchId);
        })
        .then(done, done.fail)
        .catch(done);
    });
  });
});
