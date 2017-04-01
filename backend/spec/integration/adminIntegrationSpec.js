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
    let browserState;

    beforeEach(() => {
      browserState = {};
      return integrationTestHelpers.createBranch(agent)
        .tap(branch => {
          browserState.branch = branch;
        })
        .then(integrationTestHelpers.createBranchAdmin(agent))
        .tap(adminUser => {
          browserState.adminUser = adminUser;
        })
        .then(integrationTestHelpers.authenticateBranchAdmin(agent));
    });

    describe('add', () => {
      it('should return 200 and a created user when the input is valid', () => (
        agent.post(`/branches/${browserState.branch.id}/admins`)
          .set('Content-Type', 'application/json')
          .send(makeAdminUser(browserState.branch))
          .expect(200)
          .expect(hasAdmin)
      ));

      it('should return 400 if the input is null', () => (
        agent.post(`/branches/${browserState.branch.id}/admins`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send(null)
          .expect(400)
      ));

      it('should return 400 if the input is incomplete', () => (
        agent.post(`/branches/${browserState.branch.id}/admins`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send(makeInvalidUser(browserState.branch))
          .expect(400)
      ));
    });

    describe('delete', () => {
      it('should return a 200 when the admin is successfully deleted', () => (
        agent.delete(`/branches/${browserState.adminUser.branchId}/admins/${browserState.adminUser.id}`)
          .expect(200)
      ));

      it('should return 404 when trying to delete a admin that does not exist', () => (
        agent.delete(`/branches/${browserState.adminUser.branchId}/admins/${uuid.v4()}`)
          .expect(404)
      ));
    });

    describe('update', () => {
      it('should return 200 and an updated user when the input is valid', () => (
        agent.put(`/branches/${browserState.adminUser.branchId}/admins/${browserState.adminUser.id}`)
          .set('Content-Type', 'application/json')
          .send(makeAdminUserUpdates(browserState.adminUser))
          .expect(200)
          .expect(hasAdmin)
      ));

      it('should allow update without the password field in the payload', () => (
        agent.put(`/branches/${browserState.adminUser.branchId}/admins/${browserState.adminUser.id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send(makeAdminUserUpdateWithoutPassword(browserState.adminUser))
          .expect(200)
          .expect(hasAdmin)
      ));

      it('should return 400 if the input is null', () => (
        agent.put(`/branches/${browserState.adminUser.branchId}/admins/${browserState.adminUser.id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send(null)
          .expect(400)
      ));

      it('should return 404 if updating an admin that does not exist', () => (
        agent.put(`/branches/${browserState.adminUser.branchId}/admins/whatevs`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send(makeInvalidAdminUserUpdates(browserState.adminUser))
          .expect(404)
      ));
    });
  });

  describe('super admins', () => {
    describe('add', () => {
      it('should return a 200 when a super admin is successfully created', () => (
        integrationTestHelpers.createSuperAdmin(agent)
          .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
          .then(() => (
            agent.post('/admins')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send(makeSuperAdmin())
              .expect(200)
              .then(hasAdmin)
          ))
      ));

      it('should return a 400 when the payload is invalid', () => (
        integrationTestHelpers.createSuperAdmin(agent)
          .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
          .then(() => (
            agent.post('/admins')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send({ email: 'supaAdmin@rabblerouser.org' })
              .expect(400)
          ))
      ));

      it('should allow only super admins to add super admins', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
          .tap(integrationTestHelpers.createBranchAdmin(agent))
          .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
          .then(() => (
            specialAgent.post('/admins')
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send(makeSuperAdmin())
              .expect(401)
          ));
      });
    });

    describe('update', () => {
      let browserState;

      beforeEach(() => {
        browserState = {};
        return integrationTestHelpers.createSuperAdmin(agent)
          .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
          .then(() => integrationTestHelpers.createSuperAdmin(agent, 'supaAdmin@rabblerouser.org'))
          .then(admin => {
            browserState.superAdmin = admin;
          });
      });

      it('should return a 200 when a super admin is successfully updated', () => {
        const withUpdates = Object.assign({}, browserState.superAdmin, { name: 'My New Name' });

        return agent.put(`/admins/${browserState.superAdmin.id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send(withUpdates)
          .expect(200)
          .then(response => {
            expect(response.body).to.be.an('object');
            expect(response.body.id).to.be.a('string');
            expect(response.body.email).to.equal(browserState.superAdmin.email);
            expect(response.body.name).to.equal('My New Name');
          });
      });

      it('should return a 400 when the payload is invalid', () => (
        agent.put(`/admins/${browserState.superAdmin.id}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
          .send({ email: '   ' })
          .expect(400)
      ));

      it('should allow only super admins to update super admins', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
          .tap(integrationTestHelpers.createBranchAdmin(agent))
          .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
          .then(() => (
            specialAgent.put(`/admins/${browserState.superAdmin.id}`)
              .set('Content-Type', 'application/json')
              .set('Accept', 'application/json')
              .send(makeSuperAdmin())
              .expect(401)
          ));
      });
    });

    describe('list', () => {
      it('should return a 200 when a super admins list is retrieved', () => (
        integrationTestHelpers.createSuperAdmin(agent)
          .tap(integrationTestHelpers.authenticateSuperAdmin(agent))
          .then(() => integrationTestHelpers.createSuperAdmin(agent, 'someone@example.com'))
          .then(() => integrationTestHelpers.createSuperAdmin(agent, 'someone-else@example.com'))
          .then(() => (
            agent.get('/admins')
              .expect(200)
              .then(response => {
                expect(response.body).to.be.an('object');
                expect(response.body.admins.length).to.equal(3);
              })
          ))
      ));

      it('should allow only super admins to get the admins list', () => {
        const specialAgent = request.agent(app);

        return integrationTestHelpers.createBranch(agent)
          .tap(integrationTestHelpers.createBranchAdmin(agent))
          .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
          .then(() => specialAgent.get('/admins')
            .expect(401)
          );
      });
    });

    xdescribe('delete', () => {
      let browserState = {};

      beforeEach(() => integrationTestHelpers.createSuperAdmin(agent)
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
                .tap(integrationTestHelpers.createBranchAdmin(agent))
                .tap(integrationTestHelpers.authenticateBranchAdmin(specialAgent))
                .then(() => specialAgent.delete('/admins/someId')
                    .expect(401));
      });
    });
  });
});
