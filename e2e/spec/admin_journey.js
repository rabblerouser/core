import { startAtLogin,
  enterName,
  enterEmail,
  enterContactNumber,
  enterPassword,
  enterConfirmedPassword,
  enterGroupName,
  enterGroupDescription,
  enterBranchName,
  enterBranchContact,
  enterParticipantName,
  selectBranch,
  selectGroup,
  clickEditOrganiser,
  clickEditParticipant,
  clickEditAdmin,
  clickEditCurrentGroup,
  clickEditBranch,
  clickLogin,
  clickLogout,
  clickNewOrganiser,
  clickNewAdmin,
  clickNewGroup,
  clickNewBranch,
  clickDetailsTab,
  clickSave,
  title,
  waitForExisting,
  waitForGroupOption,
  waitForBranchOption,
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

const adminLogsInAndOut = {
  description: 'As an admin I should be able to login',
  testRun: test => {
    adminLogin()
    .then(() => test.assertEquals(title(), 'Rabble Rouser Admin', 'I am on the admin page'))
    .then(clickLogout)
    .then(() => test.assertEquals(title(), 'Login', 'I am on the login page'));
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

function fillNewAdmin() {
  return enterEmail('anotherAdmin@email.com')
    .then(() => enterName('Chris'))
    .then(() => enterContactNumber('0401-223-443'))
    .then(() => enterPassword('a long password'))
    .then(() => enterConfirmedPassword('a long password'))
    .then(() => clickSave());
}

function editLastAdmin() {
  return enterName('Christopher')
    .then(clickSave);
}

const adminCanAddAnAdmin = {
  description: 'As an admin I should be able to add an admin to a branch',
  testRun: () => {
    adminLogin()
    .then(clickNewAdmin)
    .then(fillNewAdmin)
    .then(() => waitForExisting('Chris'));
  },
};

const adminCanEditAnAdmin = {
  description: 'As an admin I should be able to edit an admin for a branch',
  testRun: () => {
    adminLogin()
    .then(() => waitForExisting('Chris'))
    .then(clickEditAdmin)
    .then(editLastAdmin)
    .then(() => waitForExisting('Christopher'));
  },
};

function fillNewGroup() {
  return enterGroupName('A group')
    .then(() => enterGroupDescription('This group does things'))
    .then(() => clickSave());
}

function editGroup() {
  return enterGroupName('A group changed')
    .then(clickSave);
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

function editParticipant() {
  return enterParticipantName('A changed name')
    .then(clickSave);
}

const adminCanEditAParticipant = {
  description: 'As an admin I should be able to edit a participant',
  testRun: () => {
    adminLogin()
    .then(() => waitForGroupOption('A group with member'))
    .then(() => selectGroup('A group with member'))
    .then(() => waitForExisting('A name'))
    .then(clickEditParticipant)
    .then(clickDetailsTab)
    .then(editParticipant);
    // Disabled pending issue resolution: https://huboard.com/rabblerouser/rabblerouser-core#/issues/158499200
    // .then(() => waitForExisting('A changed name'));
  },
};

function fillNewBranch() {
  return enterBranchName('A new branch')
    .then(() => enterBranchContact('This branch contact'))
    .then(() => clickSave());
}

function editBranch() {
  return enterBranchName('A branch changed')
    .then(clickSave);
}

const adminCanAddABranch = {
  description: 'As an admin I should be able to add a branch',
  testRun: () => {
    adminLogin()
    .then(clickNewBranch)
    .then(fillNewBranch)
    .then(() => waitForBranchOption('A new branch'))
    .then(() => selectBranch('A new branch'))
    .then(() => waitForExisting('This branch contact'));
  },
};

const adminCanEditABranch = {
  description: 'As an admin I should be able to edit a branch',
  testRun: () => {
    adminLogin()
    .then(() => waitForBranchOption('A new branch'))
    .then(clickEditBranch)
    .then(editBranch)
    .then(() => waitForBranchOption('A branch changed'));
  },
};

export default [
  adminCanAddAnOrganiser,
  adminCanEditAnOrganiser,
  adminCanAddAGroup,
  adminCanEditAGroup,
  adminCanEditAParticipant,
  adminCanAddABranch,
  adminCanEditABranch,
  adminCanAddAnAdmin,
  adminCanEditAnAdmin,
  adminTriesToLoginWithWrongPassword,
  adminLogsInAndOut,
];
