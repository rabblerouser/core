const resourceValidators = require('../../../src/middlewares/resourceValidators');
const store = require('../../../src/store');

describe('resourceValidators', () => {
  let sandbox;
  let res;
  let next;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    res = { sendStatus: sinon.spy() };
    next = sinon.spy();
    sandbox.stub(store, 'getBranches').returns([{ id: 'branch-1' }, { id: 'branch-2' }]);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('checkBranchPresence', () => {
    it('calls next when the branch exists', () => {
      const req = { params: { branchId: 'branch-1' } };

      resourceValidators.checkBranchPresence(req, res, next);

      expect(next).to.have.been.calledWith();
      expect(res.sendStatus).not.to.have.been.calledWith(404);
    });

    it('errors when the branch does not exist', () => {
      const req = { params: { branchId: 'bad-branch' } };

      resourceValidators.checkBranchPresence(req, res, next);

      expect(next).not.to.have.been.calledWith();
      expect(res.sendStatus).to.have.been.calledWith(404);
    });
  });
});
