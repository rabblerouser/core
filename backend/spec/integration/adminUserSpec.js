'use strict';

const integrationTestHelpers = require('./integrationTestHelpers.js');
const AdminUser = require('../../src/models').AdminUser;

describe('AdminUser', () => {
  const email = 'orgnisr@rabblerouser.org.au';
  const password = 'orgnisr';

  beforeEach(() => integrationTestHelpers.resetDatabase());

  describe('authenticate', () => {
    let cb;

    beforeEach(() => {
      cb = sinon.stub();
    });

    it('calls back with the user if the user exists and can be authenticated', () => AdminUser.create({ email, password })
            .then(() => AdminUser.authenticate(email, password, cb)).then(() => {
              expect(cb).to.have.been.calledWith(null, sinon.match({ email }));
            }));

    it('calls back with false if the user exists but cannot be authenticated', () => AdminUser.create({ email, password })
            .then(() => AdminUser.authenticate(email, 'wrongpassword', cb)).then(() => {
              expect(cb).to.have.been.calledWith(null, false);
            }));

    it('calls back with false if the user does not exist', () => AdminUser.authenticate(email, password, cb)
            .then(() => {
              expect(cb).to.have.been.calledWith(null, false);
            }));

    it('has an encrypted password', () => AdminUser.create({ email, password })
            .then(user => {
              expect(user.password).not.to.equal(password);
            }));
  });
});
