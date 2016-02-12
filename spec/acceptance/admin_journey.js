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

casper.test.begin('Test the admin flow', 6, function suite(test) {
    var email = casper.cli.get("email");
    var password = casper.cli.get("password");
    var url = casper.cli.get("url");
    casper.start(url+ '/admin', function() {
        test.assertTitle("Login");
    });

    //login
    casper.then(function () {
        this.sendKeys('input[id=email]', email);
        this.sendKeys('input[id=password]', password);
        this.click('input[id=login]');
    });

    casper.waitForUrl(url + '/admin', function () {
        this.test.assertUrlMatches(url + '/admin');
        test.assertSelectorHasText('h1', 'Admin Dashboard');
    });

    //goto secretary
    casper.then(function () {
        casper.then(function() {
            this.click('input[id=secretary]');
            casper.then(function() {
                test.assertExist('table.admin-table');
                test.assertSelectorHasText('th','First NameLast NamePostcodeStateCountryMembershipStatus');
                //Check that some kind of data exists
                casper.waitForSelector('td', function () {
                    test.assertSelectorExists('td');
                });
            });
        });
    });

    casper.run(function () {
        test.done();
    });
});