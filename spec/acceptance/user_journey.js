import './casperHelper';
import { startAtRegister,
  clickContinue,
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
  enterOtherSchoolType,
  selectLab } from './pages/registrationPage';
const casper = window.casper;
const then = casper.then.bind(casper);

casper.test.begin('I should get validation errors if I don\'t fill in the form', 3, test => {
  startAtRegister();
  then(() => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
  clickContinue();
  then(() => test.assertNotEquals(visibleValidationErrors(), ''));
  casper.wait(200, () => test.assertEquals(visibleProgressMessage(), 'Register for The Lab'));
  casper.run(() => test.done());
});

casper.test.begin('I should be able to register', 3, test => {
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
  enterOtherSchoolType('Laboriosam');
  enterAdditionalInfo('More text');
  clickContinue();
  then(() => {
    test.assertEquals(visibleValidationErrors(), '');
    casper.wait(200, () => test.assertEquals(visibleProgressMessage(), 'Finish'));
  });
  casper.run(() => {test.done(); casper.exit();});
});
