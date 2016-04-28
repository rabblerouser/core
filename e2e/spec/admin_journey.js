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

//When I login
// I can see my lab listed

// I can add an oganiser
// I can edit an organiser
// I can remove and organiser

// I can add a group
// I can edit a group
// I can remove group

//When I login as a admin
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
  adminTriesToLoginWithWrongPassword,
  adminCanUseTheDashboardForTheirLab
];
