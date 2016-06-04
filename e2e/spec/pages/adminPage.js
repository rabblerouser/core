import { navigateTo,
  inputById,
  buttonPressByText,
  pageTitle,
  buttonPressBySelector,
  selectOptionById,
  waitForInnerText,
  waitForOptionInSelectById,
} from './common';

export const startAtLogin = () => navigateTo('/login');
export const enterEmail = email => inputById('email', email);
export const enterPassword = password => inputById('password', password);
export const enterConfirmedPassword = confirmedPassword => inputById('confirmedPassword', confirmedPassword);
export const enterName = name => inputById('name', name);
export const enterContactNumber = contactNumber => inputById('contactNumber', contactNumber);
export const enterGroupName = name => inputById('groupName', name);
export const enterGroupDescription = description => inputById('groupDescription', description);
export const enterBranchName = name => inputById('name', name);
export const enterBranchContact = description => inputById('contact', description);
export const selectGroup = option => selectOptionById('groups', option);
export const selectBranch = option => selectOptionById('branches', option);
export const clickEditCurrentGroup = () => buttonPressBySelector('#group-details button.edit');
export const clickEditOrganiser = () => buttonPressBySelector('#organisers tbody tr:last-child button.edit');
export const clickEditBranch = () => buttonPressBySelector('#branchDetails button.edit');
export const clickLogin = () => buttonPressBySelector('input[id=login]');
export const clickNewOrganiser = () => buttonPressBySelector('#organisers button.new');
export const clickNewGroup = () => buttonPressBySelector('#group-details button.new');
export const clickNewBranch = () => buttonPressBySelector('#branchDetails button.new');
export const clickSave = () => buttonPressByText('Save');
export const waitForExisting = name => waitForInnerText('body', name);
export const waitForGroupOption = name => waitForOptionInSelectById('groups', name);
export const waitForBranchOption = name => waitForOptionInSelectById('branches', name);
export const title = pageTitle;
