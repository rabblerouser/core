import { navigateTo,
  inputById,
  buttonPressById,
  buttonPressByText,
  pageTitle,
  buttonPressBySelector,
  selectOptionById,
  waitForInnerText,
  waitForNoInnerText,
  waitForOptionInSelectById,
  waitForNoOptionInSelectById,
} from './common';

export const startAtLogin = () => navigateTo('/login');
export const enterEmail = email => inputById('email', email);
export const enterPassword = password => inputById('password', password);
export const enterConfirmedPassword = confirmedPassword => inputById('confirmedPassword', confirmedPassword);
export const enterName = name => inputById('name', name);
export const enterContactNumber = contactNumber => inputById('contactNumber', contactNumber);
export const enterGroupName = name => inputById('groupName', name);
export const enterGroupDescription = description => inputById('groupDescription', description);
export const selectGroup = selection => selectOptionById('groups', selection);
export const clickEditCurrentGroup = () => buttonPressBySelector('#group-details button.edit');
export const clickDeleteCurrentGroup = () => buttonPressBySelector('#group-details button.delete');
export const clickEditOrganiser = () => buttonPressBySelector('#organisers tbody tr:last-child button.edit');
export const clickDeleteOrganiser = () => buttonPressBySelector('#organisers tbody tr:last-child button.delete');
export const clickLogin = () => buttonPressById('login');
export const clickNewOrganiser = () => buttonPressBySelector('#organisers button.new');
export const clickNewGroup = () => buttonPressBySelector('#group-details button.new');
export const clickConfirmDelete = () => buttonPressByText('Okay');
export const clickSave = () => buttonPressByText('Save');
export const waitForExisting = name => waitForInnerText('body', name);
export const waitForNotExisting = name => waitForNoInnerText('body', name);
export const waitForGroupOption = name => waitForOptionInSelectById('groups', name);
export const waitForNoGroupOption = name => waitForNoOptionInSelectById('groups', name);
export const title = pageTitle;
