casper.test.begin('Test the project-m-staging', 6, function suite(test) {
    casper.start('https://project-m-staging.herokuapp.com/', function () {
        test.assertTitle('Express');
        test.assertSelectorHasText('h1.form-title', 'Membership Type');  //find the title
    });

    casper.then(function () {

      //test for error
      casper.then(function() {
        this.click('input[name="isEnrolled"][value="No"]');
        this.click('input[name="residentialStatus"][value="I am an Australian citizen."]');
        this.click('input[name="isMemberOfOtherParty"][value="Yes"]');

        test.assertExist('div.validationErrors');
      });

      // test for correct
      casper.then(function() {
        this.click('input[name="isEnrolled"][value="Yes"]');

        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3[data-reactid=".0.0.0.1.1.5.0.0"]', 'You are entitled to a Supporter Membership.'); //呀，这么简单。。。要哭了都，整了一晚上。。
      });

      // //test for jump to second page
      // casper.then(function() {
      //   this.click('button[data-reactid=".0.0.0.1.0"]')
      //   casper.then(function() {
      //     test.assertSelectorHasText('h1.form-title', 'Details');  //find the title
      //   });
      // });
      });

      casper.run(function () {
        test.done();
    })
});
