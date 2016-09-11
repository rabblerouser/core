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
  enterMemberName,
  selectBranch,
  selectGroup,
  clickEditOrganiser,
  clickEditMember,
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

const testID = Date.now();

function login(email, password) {
  return enterEmail(email)
    .then(() => enterPassword(password))
    .then(clickLogin);
}

const adminTriesToLoginWithWrongPassword = {
  description: 'I should not be able to login with the wrong credentials',
  testRun: test => {
    startAtLogin()
    .then(() => test.assertEquals(title(), 'Rabble Rouser - Login', 'I am on the login page'))
    .then(() => login('orgnsr@thebranch.org', 'bad password'))
    .then(() => test.assertEquals(title(), 'Rabble Rouser - Login', 'I am on the login page'));
  },
};

function adminLogin() {
  return startAtLogin()
  .then(() => login('admin@rr.com', 'apassword'))
  .waitForUrl(/dashboard\/admin$/);
}

const adminLogsInAndOut = {
  description: 'As an admin I should be able to login',
  testRun: test => {
    adminLogin()
    .then(() => test.assertEquals(title(), 'Rabble Rouser - Admin', 'I am on the admin page'))
    .then(clickLogout)
    .then(() => test.assertEquals(title(), 'Rabble Rouser - Login', 'I am on the login page'));
  },
};

function fillNewOrganiser() {
  return enterEmail(`${testID}organiser@email.com`)
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
  return enterEmail(`${testID}anotherAdmin@email.com`)
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
  return enterGroupName(`${testID}A group`)
    .then(() => enterGroupDescription('This group does things'))
    .then(() => clickSave());
}

function editGroup() {
  return enterGroupName(' changed')
    .then(clickSave);
}

const adminCanAddAGroup = {
  description: 'As an admin I should be able to add a group',
  testRun: () => {
    adminLogin()
    .then(clickNewGroup)
    .then(fillNewGroup)
    .then(() => waitForGroupOption(`${testID}A group`))
    .then(() => selectGroup(`${testID}A group`))
    .then(() => waitForExisting('This group does things'));
  },
};

const adminCanEditAGroup = {
  description: 'As an admin I should be able to edit a group',
  testRun: () => {
    adminLogin()
    .then(() => waitForGroupOption(`${testID}A group`))
    .then(() => selectGroup(`${testID}A group`))
    .then(clickEditCurrentGroup)
    .then(editGroup)
    .then(() => waitForGroupOption(`${testID}A group changed`));
  },
};

function editMember() {
  return enterMemberName('A changed name')
    .then(clickSave);
}

const adminCanEditAMember = {
  description: 'As an admin I should be able to edit a member',
  testRun: () => {
    adminLogin()
    .then(() => waitForGroupOption('A group with member'))
    .then(() => selectGroup('A group with member'))
    .then(() => waitForExisting('A name'))
    .then(clickEditMember)
    .then(clickDetailsTab)
    .then(editMember)
    .then(() => waitForExisting('A changed name'));
  },
};

function fillNewBranch() {
  return enterBranchName(`${testID}A new branch`)
    .then(() => enterBranchContact('This branch contact'))
    .then(() => clickSave());
}

function editBranch() {
  return enterBranchName(' changed')
    .then(clickSave);
}

const adminCanAddABranch = {
  description: 'As an admin I should be able to add a branch',
  testRun: () => {
    adminLogin()
    .then(clickNewBranch)
    .then(fillNewBranch)
    .then(() => waitForBranchOption(`${testID}A new branch`))
    .then(() => selectBranch(`${testID}A new branch`))
    .then(() => waitForExisting('This branch contact'));
  },
};

const adminCanEditABranch = {
  description: 'As an admin I should be able to edit a branch',
  testRun: () => {
    adminLogin()
    .then(() => waitForBranchOption(`${testID}A new branch`))
    .then(() => selectBranch(`${testID}A new branch`))
    .then(clickEditBranch)
    .then(editBranch)
    .then(() => waitForBranchOption(`${testID}A new branch changed`));
  },
};

export default [
  adminCanEditAMember,
  adminCanAddAnOrganiser,
  adminCanEditAnOrganiser,
  adminCanAddAGroup,
  adminCanEditAGroup,
  adminCanAddABranch,
  adminCanEditABranch,
  adminCanAddAnAdmin,
  adminCanEditAnAdmin,
  adminTriesToLoginWithWrongPassword,
  adminLogsInAndOut,
];
