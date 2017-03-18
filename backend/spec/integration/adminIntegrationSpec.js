'use strict';

const instanceUrl = process.env.INSTANCE_URL;
const app = instanceUrl || require('../../src/app');
const request = require('supertest-as-promised');
const integrationTestHelpers = require('./integrationTestHelpers.js');
const uuid = require('node-uuid');

const hasAdmin = res => {
  if (!(res.body.email)) {
    throw new Error('missing created admin');
  }
};

const makeSuperAdmin = email => {
  email = email || 'supaAdmin@rabblerouser.org';
  return {
    email,
    password: 'supaP@sw0r dddd!!',
  };
};

function postSuperAdmin(someAgent, email) {
  return function () {
    return someAgent.post('/admins')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(makeSuperAdmin(email))
        .expect(200);
  };
}

const makeAdminUser = branch => ({
  email: 'newOrgnrr@rabblerouser.org',
  password: 'ooooooorganiser',
  branchId: branch.id,
});

const makeAdminUserUpdates = admin => ({
  email: admin.email,
  password: 'nooo password',
  branchId: admin.branchId,
  id: admin.id,
  name: 'some name',
  phoneNumber: '04030403',
});

const makeInvalidAdminUserUpdates = admin => ({
  email: 'bad-email',
  password: 'nooo password',
  branchId: admin.branchId,
  id: admin.id,
  name: 'some name',
  phoneNumber: '04030403',
});

const makeAdminUserUpdateWithoutPassword = admin => ({
  email: admin.email,
  branchId: admin.branchId,
  id: admin.id,
  name: 'some name',
  phoneNumber: '04030403',
});

const makeInvalidUser = branch => {
  const admin = makeAdminUser(branch);
  admin.email = null;
  return admin;
};

describe('AdminIntegrationTests', () => {
  let agent;

  beforeEach(() => {
    agent = request.agent(app);

    return integrationTestHelpers.resetDatabase();
  });

  describe('admins', () => {
    let browserState = {};

    beforeEach(() => integrationTestHelpers.createBranch(agent)
            .tap(branch => {
              browserState.branch = branch;
            })
            .then(integrationTestHelpers.createBranchAdmin)
            .tap(adminUser => {
              browserState.adminUser = adminUser;
            })
            .then(integrationTestHelpers.authenticateBranchAdmin(agent)));

    afterEach(() => {
      browserState = {};
    });

    describe('add', () => {
      it('should return 200 and a created user when the input is valid', () => agent.post(`/branches/${browserState.branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .send(makeAdminUser(browserState.branch))
                    .expect(200)
                    .expect(hasAdmin));

      it('should return 400 if the input is null', () => agent.post(`/branches/${browserState.branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400));

      it('should return 400 if the input is incomplete', () => agent.post(`/branches/${browserState.branch.id}/admins`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeInvalidUser(browserState.branch))
                    .expect(400));
    });

    describe('delete', () => {
      it('should return a 200 when the admin is successfully deleted', () => agent.delete(`/branches/${browserState.adminUser.dataValues.branchId}/admins/${browserState.adminUser.dataValues.id}`)
                .expect(200));

      it('should return a 400 if the input data is not valid', () => agent.delete(`/branches/${browserState.adminUser.dataValues.branchId}/admins/whatevs`)
                .expect(400));

      it('should return 500 when trying to delete a admin that does not exist', () => agent.delete(`/branches/${browserState.adminUser.dataValues.branchId}/admins/${uuid.v4()}`)
                .expect(500));
    });

    describe('update', () => {
      it('should return 200 and an updated user when the input is valid', () => agent.put(`/branches/${browserState.adminUser.dataValues.branchId}/admins/${browserState.adminUser.dataValues.id}`)
                    .set('Content-Type', 'application/json')
                    .send(makeAdminUserUpdates(browserState.adminUser))
                    .expect(200)
                    .expect(hasAdmin));

      it('should allow update without the password field in the payload', () => agent.put(`/branches/${browserState.adminUser.dataValues.branchId}/admins/${browserState.adminUser.dataValues.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeAdminUserUpdateWithoutPassword(browserState.adminUser))
                    .expect(200)
                    .expect(hasAdmin));

      it('should return 400 if the input is null', () => agent.put(`/branches/${browserState.adminUser.dataValues.branchId}/admins/${browserState.adminUser.dataValues.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(null)
                    .expect(400));

      it('should return 400 if the input is incomplete', () => agent.put(`/branches/${browserState.adminUser.dataValues.branchId}/admins/whatevs`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeInvalidAdminUserUpdates(browserState.adminUser))
                    .expect(400));
    });
  });

  describe('super admins', () => {
    describe('add', () => {
      it('should return a 200 when a super admin is successfully created', () => integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => agent.post('/admins')
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send(makeSuperAdmin())
                        .expect(200)
                        .then(hasAdmin)));

      it('should return a 400 when the payload is invalid', () => integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(() => agent.post('/admins')
                        .set('Content-Type', 'application/json')
                        .set('Accept', 'application/json')
                        .send({ email: 'supaAdmin@rabblerouser.org' })
                        .expect(400)));

      it('should allow only super admins to add super admins', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => specialAgent.post('/admins')
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeSuperAdmin())
                    .expect(401));
      });
    });

    describe('update', () => {
      let browserState = {};

      beforeEach(() => integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(postSuperAdmin(agent))
                .then(response => {
                  browserState.superAdmin = response.body;
                }));

      afterEach(() => {
        browserState = {};
      });

      it('should return a 200 when a super admin is successfully created', () => {
        const withUpdates = Object.assign({}, browserState.superAdmin, { name: 'My New Name' });

        return agent.put(`/admins/${browserState.superAdmin.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(withUpdates)
                    .expect(200)
                    .then(response => {
                      expect(response.body).not.to.be.empty;
                      expect(response.body.id).not.to.be.empty;
                      expect(response.body.email).to.equal(browserState.superAdmin.email);
                      expect(response.body.name).to.equal('My New Name');
                    });
      });

      it('should return a 400 when the payload is invalid', () => agent.put(`/admins/${browserState.superAdmin.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send({ email: 'supaAdmin@rabblerouser.org' })
                    .expect(400));

      it('should allow only super admins to update super admins', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => specialAgent.put(`/admins/${browserState.superAdmin.id}`)
                    .set('Content-Type', 'application/json')
                    .set('Accept', 'application/json')
                    .send(makeSuperAdmin())
                    .expect(401));
      });
    });

    describe('list', () => {
      it('should return a 200 when a super admins list is retrieved', () => integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(postSuperAdmin(agent, 'bal@asd.co'))
                .then(postSuperAdmin(agent))
                .then(() => agent.get('/admins')
                    .expect(200)
                    .then(response => {
                      const theOneCreatedToAuthenticateTheRequest = 1;
                      expect(response.body).not.to.be.null;
                      expect(response.body.admins).not.to.be.null;
                      expect(response.body.admins.length).to.equal(2 + theOneCreatedToAuthenticateTheRequest);
                    })));

      it('should allow only super admins to get the admins list', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => specialAgent.get('/admins')
                    .expect(401));
      });
    });

    describe('delete', () => {
      let browserState = {};

      beforeEach(() => integrationTestHelpers.createSuperAdmin()
                .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
                .then(postSuperAdmin(agent))
                .then(response => {
                  browserState.superAdmin = response.body;
                }));

      afterEach(() => {
        browserState = {};
      });

      it('should return a 200 when a super admin is successfully created', () => agent.delete(`/admins/${browserState.superAdmin.id}`)
                    .expect(200));

      it('should return a 400 when the payload is invalid', () => agent.delete('/admins/whatevs')
                    .expect(400));

      it('should allow only super admins to update super admins', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
                .tap(integrationTestHelpers.createBranchAdmin)
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => specialAgent.delete('/admins/someId')
                    .expect(401));
      });
    });
  });
});
