module.exports = {
  'Signup tests' :  client => {
    const signup = client.page.signup();
    signup.navigate().assert.title('Sign Up');
    signup.api.pause(2000);
    signup.expect.section('@registration').to.be.visible;
    const registration = signup.section.registration;

    registration.expect.element('@firstName').to.be.visible;
    registration.expect.element('@lastName').to.be.visible;
    registration.expect.element('@email').to.be.visible;
    registration.expect.element('@primaryPhoneNumber').to.be.visible;
    registration.expect.element('@additionalInfo').to.be.visible;
    registration.expect.element('@submitButton').to.be.visible;

    registration.setValue('@primaryPhoneNumber', '555100000')
    registration.setValue('@firstName', 'Margaret')
    registration.setValue('@lastName', 'Robins')
    registration.setValue('@email', 'mrobins@brooklyn.com')
    registration.setValue('@additionalInfo', 'just checking in');
    registration.submit();
    registration.expect.element('@submitButton').not.to.be.present;
    signup.expect.section('@registration').not.to.be.present;
    signup.expect.section('@finished').to.be.present;;

    const finished = signup.section.finished;
    finished.expect.element('@heading').to.be.visible;
    finished.expect.element('@heading').text.to.contain('Thank you, we have received your details.');

    client.end();
  }
};
