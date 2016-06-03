import { startAtLogin,
  enterName,
  enterEmail,
  enterContactNumber,
  enterPassword,
  enterConfirmedPassword,
  enterGroupName,
  enterGroupDescription,
  selectGroup,
  clickEditCurrentGroup,
  clickEditOrganiser,
  clickLogin,
  clickNewOrganiser,
  clickNewGroup,
  clickSave,
  title,
  waitForExisting,
  waitForGroupOption,
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
    .then(() => login('orgnsr@thebranch.org', 'bad password'))
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'));
  },
};

function adminLogin() {
  return startAtLogin()
  .then(() => login('admin@rr.com', 'apassword'))
  .then(() =>
    window.casper.waitForUrl(/dashboard\/admin$/)
  );
}

const adminLogsIn = {
  description: 'As an admin I should be able to login',
  testRun: test => {
    adminLogin()
    .then(() => test.assertEquals(title(), 'Rabble Rouser Admin', 'I am on the admin page'));
  },
};

function fillNewOrganiser() {
  return enterEmail('organiser@email.com')
    .then(() => enterName('Sasha'))
    .then(() => enterContactNumber('0401-223-443'))
    .then(() => enterPassword('a long password'))
    .then(() => enterConfirmedPassword('a long password'))
    .then(() => clickSave());
}

function editLastOrganiser() {
  return enterName('Sashana')
    .then(clickSave);
}

const adminCanAddAnOrganiser = {
  description: 'As an admin I should be able to add an organiser to a branch',
  testRun: () => {
    adminLogin()
    .then(clickNewOrganiser)
    .then(fillNewOrganiser)
    .then(() => waitForExisting('Sasha'));
  },
};

const adminCanEditAnOrganiser = {
  description: 'As an admin I should be able to edit an organiser for a branch',
  testRun: () => {
    adminLogin()
    .then(() => waitForExisting('Sasha'))
    .then(clickEditOrganiser)
    .then(editLastOrganiser)
    .then(() => waitForExisting('Sashana'));
  },
};

function editGroup() {
  return enterGroupName('A group changed')
    .then(clickSave);
}

function fillNewGroup() {
  return enterGroupName('A group')
    .then(() => enterGroupDescription('This group does things'))
    .then(() => clickSave());
}

const adminCanAddAGroup = {
  description: 'As an admin I should be able to add a group',
  testRun: () => {
    adminLogin()
    .then(clickNewGroup)
    .then(fillNewGroup)
    .then(() => waitForGroupOption('A group'))
    .then(() => selectGroup('A group'))
    .then(() => waitForExisting('This group does things'));
  },
};

const adminCanEditAGroup = {
  description: 'As an admin I should be able to edit a group',
  testRun: () => {
    adminLogin()
    .then(() => waitForGroupOption('A group'))
    .then(() => selectGroup('A group'))
    .then(clickEditCurrentGroup)
    .then(editGroup)
    .then(() => waitForGroupOption('A group changed'));
  },
};

// Admin can edit a participnt
// Admin can add a lab
// Admin can edit a lab
// Admin can add an admin
// Admin can edit an admin

export default [
  adminLogsIn,
  adminTriesToLoginWithWrongPassword,
  adminCanAddAnOrganiser,
  adminCanEditAnOrganiser,
  adminCanAddAGroup,
  adminCanEditAGroup,
];
