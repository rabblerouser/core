'use strict';

const integrationTestHelpers = require('./integrationTestHelpers.js');
const AdminUser = require('../../src/models').AdminUser;

describe('AdminUser', () => {
    let email = 'orgnisr@rabblerouser.org.au',
        password = 'orgnisr';

    beforeEach(() => {
        return integrationTestHelpers.resetDatabase();
    });

    describe('authenticate', () => {
        let cb;

        beforeEach(() => {
            cb = sinon.stub();
        });

        it('calls back with the user if the user exists and can be authenticated', () => {
            return AdminUser.create({ email: email, password: password })
            .then(() => {
                return AdminUser.authenticate(email, password, cb);
            }).then(() => {
                expect(cb).to.have.been.calledWith(null, sinon.match({email: email}));
            });
        });

        it('calls back with false if the user exists but cannot be authenticated', () => {
            return AdminUser.create({ email: email, password: password })
            .then(() => {
                return AdminUser.authenticate(email, 'wrongpassword', cb);
            }).then(() => {
                expect(cb).to.have.been.calledWith(null, false);
            });
        });

        it('calls back with false if the user does not exist', () => {
            return AdminUser.authenticate(email, password, cb)
            .then(() => {
                expect(cb).to.have.been.calledWith(null, false);
            });
        });

        it('has an encrypted password', () => {
            return AdminUser.create({ email: email, password: password })
            .then((user) => {
                expect(user.password).not.to.equal(password);
            });
        });
    });
});
