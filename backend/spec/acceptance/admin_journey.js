import { startAtLogin, login, title } from './pages/adminPage';
const casper = window.casper;
const then = casper.then.bind(casper);

const adminTriesToLoginWithWrongPassword = {
  description: 'I should not be able to login with the wrong credentials',
  testRun: test => {
    startAtLogin();
    then(() => test.assertEquals(title(), 'Login'));
    login('orgnsr@thelab.org', 'bad password');
    casper.wait(200, () => test.assertEquals(title(), 'Login'));
  },
};

const adminCanUseTheDashboardForTheirLab = {
  description: 'As an admin I should be able to login and update my lab',
  testRun: test => {
    startAtLogin();
    then(() => test.assertEquals(title(), 'Login'));
    login('orgnsr@thelab.org', 'organiser');
    casper.wait(200, () => test.assertEquals(title(), 'The Lab Admin'));
  },
};

export default [
  adminTriesToLoginWithWrongPassword,
  adminCanUseTheDashboardForTheirLab
];
