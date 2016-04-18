require('casperHelper');
var registrationPage = require('pages/registrationPage');
var then = casper.then.bind(casper);

casper.test.begin('I should get validation errors if I don\'t fill in the form', 2, function suite(test) {

    registrationPage.startAtRegister();
    then(function() {
        test.assertEquals(registrationPage.progressMessage(), 'Register for The Lab')
    });
    registrationPage.clickContinue();

    then(function() {
        test.assertNotEquals(registrationPage.validationErrors(), "");
    });

    casper.run(function () {
        test.done();
    });
});

casper.test.begin('I should be able to register', 3, function suite(test) {

    registrationPage.startAtRegister();
    then(function() {
        test.assertEquals(registrationPage.progressMessage(), 'Register for The Lab');
    });

    registrationPage.fillForm.lab('Bega (NSW)');
    registrationPage.fillForm.contactName('Connor');
    registrationPage.fillForm.contactLastName('Melbourne');
    registrationPage.fillForm.contactNumber('01010101010');
    registrationPage.fillForm.participantName('Winston');
    registrationPage.fillForm.participantLastName('Sydney');
    registrationPage.fillForm.contactEmail('qoku@gmail.com');
    registrationPage.fillForm.participantBirthYear('1990');
    registrationPage.fillForm.schoolTypeOther(true);
    registrationPage.fillForm.schoolTypeOtherText('Laboriosam');
    registrationPage.fillForm.additionalInfo('More text');
    registrationPage.clickContinue();

    then(function() {
        test.assertEquals(registrationPage.validationErrors(), "");
        casper.wait(200, function () {
            return test.assertEquals(registrationPage.progressMessage(), 'Finish');
        });
    });

    casper.run(function () {
        test.done();
        this.exit();
    });
});
