import { startAtRegister,
  clickRegister,
  visibleProgressMessage,
  visibleValidationErrors,
  enterContactNumber,
  enterMemberName,
  enterMemberLastName,
  enterContactEmail,
  enterMemberBirthYear,
  enterAdditionalInfo,
  selectBranch } from './pages/registrationPage';

const userHasValidationErrors = {
  description: 'I should get validation errors if I don\'t fill in the form',
  testRun: test => {
    startAtRegister()
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register'))
    .then(clickRegister)
    .then(() => test.assertNotEquals(visibleValidationErrors(), ''))
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register'));
  },
};

function fillValidForm() {
  return selectBranch('A branch')
  .then(() => enterContactNumber('01010101010'))
  .then(() => enterMemberName('Winston'))
  .then(() => enterMemberLastName('Sydney'))
  .then(() => enterContactEmail('qoku@gmail.com'))
  .then(() => enterMemberBirthYear('1990'))
  .then(() => enterAdditionalInfo('More text'));
}

const userRegisters = {
  description: 'I should be able to register',
  testRun: test => {
    startAtRegister()
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register'))
    .then(fillValidForm)
    .then(clickRegister)
    .then(() => test.assertEquals(visibleValidationErrors(), ''))
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register'));
  },
};

export default [
  userHasValidationErrors,
  userRegisters,
];
