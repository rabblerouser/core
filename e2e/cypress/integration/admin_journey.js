import {
  startAtLogin,
  title,
  enterEmail,
  enterPassword,
  clickLogin,
  clickLogout,
} from './pages/adminPage';

describe('Login page', function () {
  beforeEach(() => {
    startAtLogin();
  })

  it('greets with Rabble Rouser Dashboard Login', function () {
    title().should('include', 'Rabble Rouser - Login');
  });

  it('stays on the Login page on unsuccessful login', function () {
    login('orgnsr@thebranch.org', 'bad password');

    title().should('include', 'Rabble Rouser - Login');
  });

  it('navigates to dashboard page on successful login', function () {
    login('admin@rr.com', 'password4321');
    cy.url().should('include', 'dashboard');
  });
});

function login(email, password) {
  return enterEmail(email)
    .then(() => enterPassword(password))
    .then(clickLogin);
}
