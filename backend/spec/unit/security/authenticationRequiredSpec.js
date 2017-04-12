const authenticationRequired = require('../../../src/security/authenticationRequired');

describe('authenticationRequired', () => {
  it('calls next when the user is authenticated', () => {
    const req = { session: {}, isAuthenticated: () => true };
    const res = { redirect: sinon.spy() };
    const next = sinon.spy();

    authenticationRequired(req, res, next);

    expect(next).to.have.been.calledWith();
    expect(res.redirect).not.to.have.been.calledWith('/login');
  });

  it('redirects when the user is not authenticated', () => {
    const req = { session: {}, isAuthenticated: () => false };
    const res = { redirect: sinon.spy() };
    const next = sinon.spy();

    authenticationRequired(req, res, next);

    expect(next).not.to.have.been.calledWith();
    expect(res.redirect).to.have.been.calledWith('/login');
  });
});
