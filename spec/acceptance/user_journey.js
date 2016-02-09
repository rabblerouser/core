casper.on('remote.message', function(message) {
    this.echo('Message: '+ JSON.stringify(message));
});

casper.on('page.error', function(message, trace) {
    this.echo('Page error: ' + message);
    this.echo(JSON.stringify(trace));
});

casper.on('page.initialized', function() {
    this.evaluate(function() {
        if (!Function.prototype.bind) {
            Function.prototype.bind = function(oThis) {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                var aArgs   = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    fNOP    = function() {},
                    fBound  = function() {
                        return fToBind.apply(this instanceof fNOP
                                             ? this
                                             : oThis,
                                             aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                if (this.prototype) {
                    // native functions don't have a prototype
                    fNOP.prototype = this.prototype;
                }
                fBound.prototype = new fNOP();

                return fBound;
            };
        }
        console.log("RegExp.prototype.bind has been polyfilled");
    });
});

casper.test.begin('Test the project-m-staging', 21, function suite(test) {
    casper.start('https://project-m-staging.herokuapp.com/', function() {


        test.assertTitle("Pirate Party Membership");
        var js = this.evaluate(function() {
            return document;
        });
        this.echo('Here is the DOM: ' + js.all[0].outerHTML);
    });

    casper.then(function () {
        test.assertSelectorHasText('h1.form-title', 'Membership Type');  //find the title
    });

    casper.then(function () {
        //test for not enrolled Australian citizen to vote in Australia
        this.click('input[name="isEnrolled"][value="No"]');
        this.click('input[name="residentialStatus"][value="I am an Australian citizen."]');
        this.click('input[name="isMemberOfOtherParty"][value="Yes"]');

        test.assertExist('div.validationErrors');
    });

     // test for supporter membership type
    casper.then(function() {
        this.click('input[name="isEnrolled"][value="Yes"]');

        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3', 'You are entitled to a Supporter Membership.');
    });

    casper.then(function() {
        this.click('input[name="isEnrolled"][value="No"]');
        this.click('input[name="residentialStatus"][value="I have a Permanent Resident visa."]');

        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3', 'You are entitled to a Supporter Membership.');
    });


    //test for full membership type
    casper.then(function() {
        this.click('input[name="isEnrolled"][value="Yes"]');
        this.click('input[name="residentialStatus"][value="I am an Australian citizen."]');
        this.click('input[name="isMemberOfOtherParty"][value="No"]');

        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3', 'You are entitled to a Full Membership.');
    });

    //test for permanent resident membership type
    casper.then(function() {
       this.click('input[name="isEnrolled"][value="No"]');
       this.click('input[name="residentialStatus"][value="I have a Permanent Resident visa."]');

       test.assertExist('div.info-box');
       test.assertSelectorHasText('h3', 'You are entitled to a Permanent Resident Membership.');
    });

    //test for international membership type
    casper.then(function() {
       this.click('input[name="residentialStatus"][value="I am an international citizen or have a Temporary visa."]');

       test.assertExist('div.info-box');
       test.assertSelectorHasText('h3', 'You are entitled to an International Membership.');
    });

    casper.then(function() {
       this.click('input[name="isMemberOfOtherParty"][value="No"]');

       test.assertExist('div.info-box');
       test.assertSelectorHasText('h3', 'You are entitled to an International Membership.');
    });

    //test for jump to second page
    casper.then(function() {
        this.click('button');
        casper.then(function() {
            test.assertSelectorHasText('h1.form-title', 'Details');
        });
    });


// Details page tests

    //Residential Address = Postal Address

    casper.then(function() {
      this.sendKeys('input[id=firstName]', 'Connor');
      this.sendKeys('input[id=lastName]', 'Melbourne');
      this.sendKeys('input[id=dateOfBirth]', '12/08/2014');
      this.sendKeys('input[id="residentialAddress[address]"]', 'Laboriosam at inventore unde quo iure adipisicing ut voluptas sed soluta ut');
      this.sendKeys('input[id="residentialAddress[suburb]"]', 'Incidunt modi necessitatibus rem vitae modi eiusmod voluptatem numquam corporis laboriosam consequatur Eos reprehenderit');
      this.evaluate(function () {
        return document.getElementById("residentialAddress[country]").selectedIndex = 38;
      });

      this.evaluate(function () {
        return document.getElementById("residentialAddress[state]").selectedIndex = 1;
      });

      this.sendKeys('input[id="residentialAddress[postcode]"]', '35191');
      this.sendKeys('input[id=email]', 'qoku'+Math.random()+'@gmail.com');
      this.sendKeys('input[id=primaryPhoneNumber]', '0412345678');

      //jump to the Confirm page
      this.click('button');

      casper.then(function() {
          this.capture('screenshots/screenshot-click.png');
          test.assertSelectorHasText('h1.form-title', 'Confirm');
      });
    });
     //go back to the Details page

      casper.then(function() {
           this.click('a#go-back');
           test.assertSelectorHasText('h1.form-title', 'Details');
      });

    //check the postal address not same as residential address

    casper.then(function() {
           this.click('input[type="checkbox"]', 'Yes');
    });
    //fill in the postal address

    casper.then(function() {
      this.evaluate(function () {
        return document.getElementById("residentialAddress[country]").selectedIndex = 38;
      });

      this.evaluate(function () {
        return document.getElementById("residentialAddress[state]").selectedIndex = 1;
      });
      this.sendKeys('input[id="postalAddress"]', '1 Margaret Street');
      this.sendKeys('input[id="postalAddress[suburb]"]', 'Cambridge');
      this.evaluate(function () {
        return document.getElementById("postalAddress[country]").selectedIndex = 13;
      });
      this.evaluate(function () {
        return document.getElementById("postalAddress[state]").selectedIndex = 7;
      });
      this.sendKeys('input[id="postalAddress[postcode]"]', '3001');

      this.click('button');

      casper.then(function() {
          this.capture('screenshots/screenshot-click.png');
          test.assertSelectorHasText('h1.form-title', 'Confirm');
      });
    });

    // Confirm page tests

    casper.then(function() {
        this.click('input[type="checkbox"]', 'circumstance');

        this.click('button');

      casper.then(function() {
        this.wait(1000,function() {

        this.capture('screenshots/screenshot-click.png');
        test.assertSelectorHasText('h1.form-title', 'Pay What You Want');
        });
      });
    });

  //Pay What You Want page

      //     //no contribute----passed
      // casper.then(function() {
      //     this.click('input[name="paymentType"][value="noContribute"]');
      //
      //     this.click('button');
      //
      //   casper.then(function() {
      //     this.wait(2000,function() {
      //     this.capture('screenshots/screenshot-click.png');
      //     test.assertSelectorHasText('h1.form-title', 'Finish');
      //     });
      //   });
      // });

      //Direct Deposit----with $20 deposit
       casper.then(function() {
           this.click('input[name="paymentType"][value="deposit"]');
           this.sendKeys('input[id=totalAmount]','20');

           this.click('button');

          casper.then(function() {
              this.wait(1000,function() {
              this.capture('screenshots/screenshot-click.png');
               test.assertSelectorHasText('h1.form-title', 'Finish');
              });
          });
       });

    casper.run(function () {
        test.done();
    });
});
