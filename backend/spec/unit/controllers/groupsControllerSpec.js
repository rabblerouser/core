'use strict';

const groupService = require('../../../src/services/groupService');
const subject = require('../../../src/controllers/groupsController');

describe('groupsController', () => {
  context('when everything is fine', () => {
    const fakeGroupsList = [
      {
        dataValues: {
          name: 'Waiting list',
          description: 'The waiting list group',
        },
      },
      {
        dataValues: {
          name: 'Tuesday at 9am',
          description: 'The list for the Tuesday at 9 group',
        },
      },
    ];

    let req;
    let res;

    beforeEach(() => {
      sinon.stub(groupService, 'list');
      res = { status: sinon.stub().returns({ json: sinon.spy() }) };
    });

    afterEach(() => {
      groupService.list.restore();
    });

    it('returns a list of groups', done => {
      groupService.list.returns(Promise.resolve(fakeGroupsList));

      subject.list(req, res)
        .then(() => {
          expect(res.status).to.have.been.calledWith(200);
          expect(res.status().json).to.have.been.calledWith({ groups: fakeGroupsList });
        })
        .then(done, done.fail)
        .catch(done);
    });
  });

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
