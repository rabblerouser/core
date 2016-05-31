import { startAtLogin,
  enterName,
  enterEmail,
  enterContactNumber,
  enterPassword,
  enterConfirmedPassword,
  clickLogin,
  clickNewOrganiser,
  clickSave,
  selectToEditLastOrganiser,
  deleteLastOrganiser,
  title,
  confirmSuccess,
} from './pages/adminPage';

const addPageConfirmFilter = () => {
  window.casper.setFilter('page.confirm', () => true);
};

const removePageConfirmFilter = () => {
  window.casper.setFilter('page.confirm', () => false);
};

function login(email, password) {
  return enterEmail(email)
    .then(() => enterPassword(password))
    .then(clickLogin);
}

function fillNewOrganiser() {
  return enterEmail('organiser@email.com')
    .then(() => enterName('Sasha'))
    .then(() => enterContactNumber('0401-223-443'))
    .then(() => enterPassword('a long password'))
    .then(() => enterConfirmedPassword('a long password'))
    .then(() => clickSave())
    .then(() => confirmSuccess());
}

function editLastOrganiser() {
  return enterName('Sashana')
    .then(clickSave)
    .then(confirmSuccess);
}

const assertHasOrganiser = (test, email, name) => {
  test.assertSelectorHasText('#organisers tbody tr:last-child', name, `the entry for ${name} is here`);
  test.assertSelectorHasText('#organisers tbody tr:last-child', email, `the entry for ${email} is here`);
};

const assertDoesNotHaveOrganiser = (test, email, name) => {
  test.assertSelectorDoesntHaveText('#organisers tbody tr:last-child', name, `the entry for ${name} is not here`);
  test.assertSelectorDoesntHaveText('#organisers tbody tr:last-child', email, `the entry for ${email} is not here`);
};

const adminTriesToLoginWithWrongPassword = {
  description: 'I should not be able to login with the wrong credentials',
  testRun: test => {
    startAtLogin()
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'))
    .then(() => login('orgnsr@thelab.org', 'bad password'))
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'));
  },
};

const adminLogsIn = {
  description: 'As an admin I should be able to login',
  testRun: test => {
    startAtLogin()
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'))
    .then(() => login('admin@rr.com', 'apassword'))
    .then(() => test.assertEquals(title(), 'Rabble Rouser Admin', 'I am on the admin page'));
  },
};

const adminCanAddAnOrganiser = {
  description: 'As an admin I should be able to add an organiser to a lab',
  testRun: test => {
    startAtLogin()
    .then(() => login('admin@rr.com', 'apassword'))
    .then(() =>
      window.casper.waitForUrl(/dashboard\/admin$/)
    )
    .then(clickNewOrganiser)
    .then(fillNewOrganiser)
    .then(() => assertHasOrganiser(test, 'organiser@email.com', 'Sasha'));
  },
};

const adminCanEditAnOrganiser = {
  description: 'As an admin I should be able to edit an organiser for a lab',
  testRun: test => {
    startAtLogin()
    .then(() => login('admin@rr.com', 'apassword'))
    .then(() =>
      window.casper.waitForUrl(/dashboard\/admin$/)
    )
    .then(() => assertHasOrganiser(test, 'organiser@email.com', 'Sasha'))
    .then(selectToEditLastOrganiser)
    .then(editLastOrganiser)
    .then(() => assertHasOrganiser(test, 'organiser@email.com', 'Sashana'));
  },
};

const adminCanDeleteAnOrganiser = {
  description: 'As an admin I should be able to delete an organiser for a lab',
  testRun: test => {
    startAtLogin()
    .then(() => login('admin@rr.com', 'apassword'))
    .then(() =>
      window.casper.waitForUrl(/dashboard\/admin$/)
    )
    .then(() => assertHasOrganiser(test, 'organiser@email.com', 'Sashana'))
    .then(addPageConfirmFilter)
    .then(deleteLastOrganiser)
    .then(removePageConfirmFilter)
    .then(confirmSuccess)
    .then(() => assertDoesNotHaveOrganiser(test, 'organiser@email.com', 'Sashana'));
  },
};

// Admin can add a group
// Admin can edit a group
// Admin can remove group
// Admin can edit a participnt
// Admin can switch labs
// Admin can add a lab
// Admin can edit a lab
// Admin can remove a lab
// Admin can add an admin
// Admin can edit an admin
// Admin can remove an admin

export default [
  adminLogsIn,
  adminTriesToLoginWithWrongPassword,
  adminCanAddAnOrganiser,
  adminCanEditAnOrganiser,
  adminCanDeleteAnOrganiser,
];
