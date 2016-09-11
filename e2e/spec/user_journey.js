import { startAtRegister,
  clickRegister,
  visibleProgressMessage,
  visibleValidationErrors,
  enterContactNumber,
  enterMemberName,
  enterMemberLastName,
  enterContactEmail,
  enterAdditionalInfo,
  selectBranch } from './pages/registrationPage';

const userHasValidationErrors = {
  description: 'I should get validation errors if I don\'t fill in the form',
  testRun: test => {
    startAtRegister()
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for Rabble Rouser'))
    .then(clickRegister)
    .then(() => test.assertNotEquals(visibleValidationErrors(), ''))
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for Rabble Rouser'));
  },
};

function fillValidForm() {
  return selectBranch('A branch')
  .then(() => enterContactNumber('01010101010'))
  .then(() => enterMemberName('Winston'))
  .then(() => enterMemberLastName('Sydney'))
  .then(() => enterContactEmail('qoku@gmail.com'))
  .then(() => enterAdditionalInfo('More text'));
}

const userRegisters = {
  description: 'I should be able to register',
  testRun: test => {
    startAtRegister()
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for Rabble Rouser'))
    .then(fillValidForm)
    .then(clickRegister)
    .then(() => test.assertEquals(visibleValidationErrors(), ''))
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for Rabble Rouser'));
  },
};

export default [
  userHasValidationErrors,
  userRegisters,
];
