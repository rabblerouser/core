import {
  startAtRegistrationPage,
} from './pages/registrationPage';

describe('Landing page', function () {
  it('contains the correct heading text', function () {
    // core is the hostname for the process set in docker-compose.test.yml:core
    startAtRegistrationPage();
    cy.title().should('include', 'Sign Up');
  });
});
