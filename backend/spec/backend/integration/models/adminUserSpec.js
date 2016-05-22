'use strict';

const specHelper = require('../../../support/specHelper.js'),
      sinon = specHelper.sinon,
      AdminUser = require('../../../../src/models/index').AdminUser;

describe('AdminUser', () => {
    let email = 'orgnisr@rabblerouser.org.au',
        password = 'orgnisr';

    describe('authenticate', () => {
        let cb;

        beforeEach(() => {
            cb = sinon.stub();
        });

        it('calls back with the user if the user exists and can be authenticated', (done) => {
            return AdminUser.create({ email: email, password: password })
                .then(() => {
                    return AdminUser.authenticate(email, password, cb);
                }).then(() => {
                    expect(cb).toHaveBeenCalledWith(null, jasmine.objectContaining({
                        email: email
                    }));
                }).then(done, done.fail);
        });

        it('calls back with false if the user exists but cannot be authenticated', (done) => {
            return AdminUser.create({ email: email, password: password })
                .then(() => {
                    return AdminUser.authenticate(email, 'wrongpassword', cb);
                }).then(() => {
                    expect(cb).toHaveBeenCalledWith(null, false);
                }).then(done, done.fail);
        });

        it('calls back with false if the user does not exist', (done) => {
            return AdminUser.authenticate(email, password, cb)
                .then(() => {
                    expect(cb).toHaveBeenCalledWith(null, false);
                }).then(done, done.fail);
        });

        it('has an encrypted password', (done) => {
        return AdminUser.create({ email: email, password: password })
            .then((user) => {
                expect(user.password).not.toBe(password);
            }).then(done, done.fail);
        });
    });
});
