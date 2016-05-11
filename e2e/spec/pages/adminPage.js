import { navigateTo, inputById, buttonPressById, buttonPressByText, pageTitle, buttonPressBySelector } from './common';

export const startAtLogin = () => navigateTo('/login');
export const enterEmail = email => inputById('email', email);
export const enterPassword = password => inputById('password', password);
export const enterConfirmedPassword = confirmedPassword => inputById('confirmedPassword', confirmedPassword);
export const enterName = name => inputById('name', name);
export const enterContactNumber = contactNumber => inputById('contactNumber', contactNumber);
export const clickLogin = () => buttonPressById('login');
export const clickNewOrganiser = () => buttonPressBySelector('#organisers button.new');
export const clickSave = () => buttonPressByText('Save');
export const selectToEditLastOrganiser = () => buttonPressBySelector('#organisers tr:last-child button.edit');
export const deleteLastOrganiser = () => buttonPressBySelector('#organisers tr:last-child button.delete');
export const clickConfirmDelete = () => buttonPressByText('Okay');
export const title = pageTitle;
