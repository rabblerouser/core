import { startAtRegister,
  clickRegister,
  visibleProgressMessage,
  visibleValidationErrors,
  enterContactName,
  enterContactLastName,
  enterContactNumber,
  enterParticipantName,
  enterParticipantLastName,
  enterContactEmail,
  enterParticipantBirthYear,
  enterAdditionalInfo,
  selectSchoolType,
  enterOtherSchool,
  selectLab } from './pages/registrationPage';

const userHasValidationErrors = {
  description: 'I should get validation errors if I don\'t fill in the form',
  testRun: test => {
    startAtRegister()
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'))
    .then(clickRegister)
    .then(() => test.assertNotEquals(visibleValidationErrors(), ''))
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
  },
};

function fillValidForm() {
  return selectLab('Frankston (Vic)')
  .then(() => enterContactName('Connor'))
  .then(() => enterContactLastName('Melbourne'))
  .then(() => enterContactNumber('01010101010'))
  .then(() => enterParticipantName('Winston'))
  .then(() => enterParticipantLastName('Sydney'))
  .then(() => enterContactEmail('qoku@gmail.com'))
  .then(() => enterParticipantBirthYear('1990'))
  .then(() => selectSchoolType('Other'))
  .then(() => enterOtherSchool('Home school'))
  .then(() => enterAdditionalInfo('More text'));
}

const userRegisters = {
  description: 'I should be able to register',
  testRun: test => {
    startAtRegister()
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'))
    .then(fillValidForm)
    .then(clickRegister)
    .then(() => test.assertEquals(visibleValidationErrors(), ''))
    .then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
  },
};

export default [
  userHasValidationErrors,
  userRegisters,
];
