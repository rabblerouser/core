import { startAtRegister,
  clickRegister,
  visibleProgressMessage,
  enterContactNumber,
  enterMemberName,
  enterMemberLastName,
  enterContactEmail,
  enterAdditionalInfo,
  selectBranch } from './pages/registrationPage';

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
    .then(clickRegister);
  },
};

export default [
  userRegisters,
];
