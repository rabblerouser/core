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
        console.log("RegExp.prototype.bind has been polyfilled")
    });
})

casper.test.begin('Test the project-m-staging', 6, function suite(test) {
    casper.start('https://project-m-staging.herokuapp.com/', function() {
        test.assertTitle("Express"); // the title should not be express - we need to change it
        this.capture('screenshots/screenshot-start.png')
        var js = this.evaluate(function() {
		        return document;
	      });
        this.echo('Here is the DOM: ' + js.all[0].outerHTML);
    });

    casper.then(function () {
        test.assertSelectorHasText('h1.form-title', 'Membership Type');  //find the title
    });

    casper.then(function () {
        //test for error
        this.click('input[name="isEnrolled"][value="No"]');
        this.click('input[name="residentialStatus"][value="I am an Australian citizen."]');
        this.click('input[name="isMemberOfOtherParty"][value="Yes"]');

        this.capture('screenshots/screenshot-validation.png')
        test.assertExist('div.validationErrors');
    });

    // test for correct
    casper.then(function() {
        this.click('input[name="isEnrolled"][value="Yes"]');

        this.capture('screenshots/screenshot-info-box.png')
        test.assertExist('div.info-box');
        test.assertSelectorHasText('h3[data-reactid=".0.0.0.1.1.5.0.0"]', 'You are entitled to a Supporter Membership.'); //呀，这么简单。。。要哭了都，整了一晚上。。
    });

    //test for jump to second page
    casper.then(function() {
        this.click('button[data-reactid=".0.0.0.1.1.6.0"]')
        casper.then(function() {
            this.capture('screenshots/screenshot-click.png')
            test.assertSelectorHasText('h1.form-title', 'Details');  //find the title
        });
    });


    casper.run(function () {
        test.done();
    });
});
