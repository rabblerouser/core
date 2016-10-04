module.exports = {
  'Registration tests' :  client => {
    const signup = client.page.signup();
    signup.navigate().assert.title('Sign Up');
    signup.expect.section('@registration').to.be.visible.before(2000);
    const registration = signup.section.registration;

    registration.expect.element('@firstName').to.be.visible.before(2000);
    registration.expect.element('@lastName').to.be.visible.before(2000);
    registration.expect.element('@email').to.be.visible.before(2000);
    registration.expect.element('@primaryPhoneNumber').to.be.visible.before(2000);
    registration.expect.element('@additionalInfo').to.be.visible.before(2000);
    registration.expect.element('@submitButton').to.be.visible.before(2000);

    registration.setValue('@primaryPhoneNumber', '555100000')
    .setValue('@firstName', 'Margaret')
    .setValue('@lastName', 'Robins')
    .setValue('@email', 'mrobins@brooklyn.com')
    .setValue('@additionalInfo', 'just checking in');
    registration.submit(registration);
    registration.expect.element('@submitButton').not.to.be.present.before(2000);
    signup.expect.section('@registration').not.to.be.present.before(2000);
    signup.expect.section('@finished').to.be.present.before(2000);;
    //
    const finished = signup.section.finished;
    finished.expect.element('@heading').to.be.visible.before(2000);
    finished.expect.element('@heading').text.to.contain('Thank you, we have received your details.');

    client.end();
  }
};
