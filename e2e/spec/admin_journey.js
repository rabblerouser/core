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
} from './pages/adminPage';

function login(email, password) {
  return enterEmail(email)
    .then(() => enterPassword(password))
    .then(clickLogin);
}

const adminTriesToLoginWithWrongPassword = {
  description: 'I should not be able to login with the wrong credentials',
  testRun: test => {
    startAtLogin()
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'))
    .then(() => login('orgnsr@thelab.org', 'bad password'))
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'));
  },
};

// When I login
// I can see my lab listed
const adminLogsInAndCanChooseLab = {
  description: 'As an admin I should be able to login and select from a list of labs',
  testRun: test => {
    startAtLogin()
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'))
    .then(() => login('orgnsr@thelab.org', 'organiser'))
    .then(() => test.assertEquals(title(), 'The Lab Admin', 'I am on the admin page'));
    // Choose lab
  },
};

// ('#organisers button.new')
// ('#organisers tr button.edit')
// ('#organisers tr button.delete')


// I can add an oganiser
// I can edit an organiser
// I can remove an organiser

const fillNewOrganiser = () =>
    enterEmail('organiser@email.com')
    .then(() => enterName('Sasha'))
    .then(() => enterContactNumber('0401-223-443'))
    .then(() => enterPassword('a long password'))
    .then(() => enterConfirmedPassword('a long password'))
    .then(() => clickSave());

const assertHasOrganiser = (test, email, name) => {
  test.assertSelectorHasText('#organisers tr:last-child', email, `the entry for ${email} is here`);
  test.assertSelectorHasText('#organisers tr:last-child', name, `the entry for ${name} is here`);
};

const assertDoesNotHaveOrganiser = (test, email, name) => {
  test.assertSelectorDoesntHaveText('#organisers tr:last-child', email, `the entry for ${email} is not here`);
  test.assertSelectorDoesntHaveText('#organisers tr:last-child', name, `the entry for ${name} is not here`);
};

const editLastOrganiser = () =>
    enterName('Sashana')
    .then(() => clickSave());

const addPageConfirmFilter = () => {
  window.casper.setFilter('page.confirm', () => true);
};

const removePageConfirmFilter = () => {
  window.casper.setFilter('page.confirm', () => false);
};


const adminCanUpdateOrganisersWithinALab = {
  description: 'As an admin I should be able to CRUD organisers for a lab',
  testRun: test => {
    startAtLogin()
    .then(() => login('super@thelab.org', 'super'))
    .then(clickNewOrganiser)
    .then(fillNewOrganiser)
    .then(() => assertHasOrganiser(test, 'organiser@email.com', 'Sasha'))
    .then(selectToEditLastOrganiser)
    .then(() => editLastOrganiser())
    .then(() => assertDoesNotHaveOrganiser(test, 'organiser@email.com', 'Sasha'))
    .then(() => assertHasOrganiser(test, 'organiser@email.com', 'Sashana'))
    .then(addPageConfirmFilter)
    .then(deleteLastOrganiser)
    .then(removePageConfirmFilter)
    .then(() => assertDoesNotHaveOrganiser(test, 'organiser@email.com', 'Sashana'));
  },
};


// I can add a group
// I can edit a group
// I can remove group
// ('#group-details button.new')
// ('#group-details #description button.edit')
// ('#group-details #description button.delete')

// I can edit a participnt
// ('#participant-list tr button.edit')


// When I login as a admin
// I can see the current lab listed
// I can switch labs

// I can add a lab
// I can edit a lab
// I can remove a lab

// I can add an admin
// I can edit an admin
// I can remove an admin

// I can add an oganiser
// I can edit an organiser
// I can remove an organiser

// I can add a group
// I can edit a group
// I can remove group


export default [
  adminLogsInAndCanChooseLab,
  adminTriesToLoginWithWrongPassword,
  adminCanUpdateOrganisersWithinALab,
];
