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

casper.test.begin('Test the project-m-staging', 8, function suite(test) {
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
        //test for not enrolled to vote in Australia
        this.click('input[name="isEnrolled"][value="No"]');
        this.click('input[name="residentialStatus"][value="I am an Australian citizen."]');
        this.click('input[name="isMemberOfOtherParty"][value="Yes"]');

        test.assertExist('div.validationErrors');
    });

     // test for supporter membership
    casper.then(function() {
        this.click('input[name="isEnrolled"][value="Yes"]');

        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3', 'You are entitled to a Supporter Membership.');
    });

    //test for full membership
    casper.then(function() {
        this.click('input[name="isMemberOfOtherParty"][value="No"]');

        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3', 'You are entitled to a Full Membership.');
    })
    //test for jump to second page
    casper.then(function() {
        this.click('button');
        casper.then(function() {
            test.assertSelectorHasText('h1.form-title', 'Details');  //find the title
        });
    });

    casper.run(function () {
        test.done();
    });
});
