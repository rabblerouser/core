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
const casper = window.casper;
const then = casper.then.bind(casper);

const userHasValidationErrors = {
  description: 'I should get validation errors if I don\'t fill in the form',
  testRun: test => {
    startAtRegister();
    then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
    clickRegister();
    then(() => test.assertNotEquals(visibleValidationErrors(), ''));
    then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
  },
};

const userRegisters = {
  description: 'I should be able to register',
  testRun: test => {
    startAtRegister();
    then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
    selectLab('Fake Branch');
    enterContactName('Connor');
    enterContactLastName('Melbourne');
    enterContactNumber('01010101010');
    enterParticipantName('Winston');
    enterParticipantLastName('Sydney');
    enterContactEmail('qoku@gmail.com');
    enterParticipantBirthYear('1990');
    selectSchoolType('Other');
    enterOtherSchool('Home school');
    enterAdditionalInfo('More text');
    clickRegister();
    then(() => {
      test.assertEquals(visibleValidationErrors(), '');
      casper.wait(200, () => test.assertEquals(visibleProgressMessage(), 'Finish'));
    });
  },
};

export default [
  userHasValidationErrors,
  userRegisters,
];
