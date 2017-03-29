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
    sandbox.stub(store, 'getAdmins').returns([{ id: 'admin-1', branchId: 'branch-1' }]);
    sandbox.stub(store, 'getMembers').returns([{ id: 'member-1', branchId: 'branch-1' }]);
    sandbox.stub(store, 'getGroups').returns([{ id: 'group-1', branchId: 'branch-1' }]);
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

  describe('checkAdminPresence', () => {
    it('calls next when the admin exists', () => {
      const req = { params: { adminId: 'admin-1' } };

      resourceValidators.checkAdminPresence(req, res, next);

      expect(next).to.have.been.calledWith();
      expect(res.sendStatus).not.to.have.been.calledWith(404);
    });

    it('errors when the admin does not exist', () => {
      const req = { params: { adminId: 'bad-admin' } };

      resourceValidators.checkAdminPresence(req, res, next);

      expect(next).not.to.have.been.calledWith();
      expect(res.sendStatus).to.have.been.calledWith(404);
    });
  });

  describe('checkBranchAdminPresence', () => {
    it('calls next when the admin and branch match', () => {
      const req = { params: { adminId: 'admin-1', branchId: 'branch-1' } };

      resourceValidators.checkBranchAdminPresence(req, res, next);

      expect(next).to.have.been.calledWith();
      expect(res.sendStatus).not.to.have.been.calledWith(404);
    });

    it('errors when the admin and branch do not match', () => {
      const req = { params: { adminId: 'admin-1', branchId: 'branch-2' } };

      resourceValidators.checkBranchAdminPresence(req, res, next);

      expect(next).not.to.have.been.calledWith();
      expect(res.sendStatus).to.have.been.calledWith(404);
    });
  });

  describe('checkBranchMemberPresence', () => {
    it('calls next when the member and branch match', () => {
      const req = { params: { memberId: 'member-1', branchId: 'branch-1' } };

      resourceValidators.checkBranchMemberPresence(req, res, next);

      expect(next).to.have.been.calledWith();
      expect(res.sendStatus).not.to.have.been.calledWith(404);
    });

    it('errors when the member and branch do not match', () => {
      const req = { params: { memberId: 'member-1', branchId: 'branch-2' } };

      resourceValidators.checkBranchMemberPresence(req, res, next);

      expect(next).not.to.have.been.calledWith();
      expect(res.sendStatus).to.have.been.calledWith(404);
    });
  });

  describe('checkBranchGroupPresence', () => {
    it('calls next when the group and branch match', () => {
      const req = { params: { groupId: 'group-1', branchId: 'branch-1' } };

      resourceValidators.checkBranchGroupPresence(req, res, next);

      expect(next).to.have.been.calledWith();
      expect(res.sendStatus).not.to.have.been.calledWith(404);
    });

    it('errors when the group and branch do not match', () => {
      const req = { params: { groupId: 'group-1', branchId: 'branch-2' } };

      resourceValidators.checkBranchGroupPresence(req, res, next);

      expect(next).not.to.have.been.calledWith();
      expect(res.sendStatus).to.have.been.calledWith(404);
    });
  });
});
