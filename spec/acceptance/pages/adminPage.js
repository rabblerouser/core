import { navigateTo, inputById, buttonPressById, pageTitle } from './common';

export const startAtLogin = () => navigateTo('/login');
export const login = (email, password) =>
  inputById('email', email)
  .then(() => inputById('password', password))
  .then(() => buttonPressById('login'));
export const title = pageTitle;
