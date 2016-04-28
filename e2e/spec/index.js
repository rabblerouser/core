import './casperHelper';
import userTests from './user_journey';
import adminTests from './admin_journey';
const casper = window.casper;

userTests.forEach(userTest => casper.test.begin(userTest.description, test => {
  userTest.testRun(test);
  casper.run(() => test.done());
}));

adminTests.forEach(adminTest => casper.test.begin(adminTest.description, test => {
  adminTest.testRun(test);
  casper.run(() => test.done());
}));
