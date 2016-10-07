module.exports = {
  'Signup tests': client => {
    const signup = client.page.signup();
    signup.navigate().assert.title('Sign Up');
    client.pause(1000);
    signup.expect.section('@details').to.be.visible;
    const details = signup.section.details;

    details.expect.element('@firstName').to.be.visible;
    details.expect.element('@lastName').to.be.visible;
    details.expect.element('@email').to.be.visible;
    details.expect.element('@primaryPhoneNumber').to.be.visible;
    details.expect.element('@additionalInfo').to.be.visible;
    details.expect.element('@submitButton').to.be.visible;

    details.setValue('@primaryPhoneNumber', '555100000');
    details.setValue('@firstName', 'Margaret');
    details.setValue('@lastName', 'Robins');
    details.setValue('@email', 'mrobins@brooklyn.com');
    details.setValue('@additionalInfo', 'just checking in');
    details.submit();
    details.expect.element('@submitButton').not.to.be.present;
    signup.expect.section('@details').not.to.be.present;
    signup.expect.section('@finished').to.be.present;

    const finished = signup.section.finished;
    finished.expect.element('@heading').to.be.visible;
    finished.expect.element('@heading').text.to.contain('Finish');

    client.end();
  },
};
