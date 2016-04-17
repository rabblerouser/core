var PATH = '/';

var input = function(id) {
    return function(text) {
        casper.then(function() {
            casper.sendKeys('#' + id, text);
        });
    };
}

var indexOfOption = function(select, option) {
    for (var i=0; i<select.length;i++) {
        if (select[i].childNodes[0].nodeValue === option){
            return i;
        }
    }
}

var selectOption = function(id) {
    return function(option) {
        return casper.thenEvaluate(function(id, option, indexOfOption) {
            var select = document.querySelector('select[id="' + id + '"]');
            if(select === null) {
                return;
            }
            select.selectedIndex = indexOfOption(select, option);
            //Event needs to be fired for React to recognise the change
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', true, true);
            select.dispatchEvent(evt);
        }, id, option, indexOfOption);
    }
}

var clickLabeledButton = function(label) {
    return function() {
        casper.then(function() {
            this.clickLabel(label, 'button');
        });
    }
}

var clickButton = function(id) {
    return function() {
        casper.then(function() {
            this.click('input[id="' + id + '"]');
        });
    }
}

var startAtRegister = function() {
    var baseUrl = casper.cli.get('url');
    casper.start(baseUrl + PATH);
}

var textAtClass = function(className) {
    return casper.evaluate(function() {
        var field = document.querySelector('.validationErrors');
        return field === null ? null : field.innerText;
    });
}

module.exports = {
    startAtRegister: startAtRegister,
    fillForm: {
        lab: selectOption('labSelection'),
        contactName: input('contactName'),
        contactLastName: input('contactLastName'),
        contactNumber: input('contactNumber'),
        participantName: input('participantName'),
        participantLastName: input('participantLastName'),
        contactEmail: input('contactEmail'),
        participantBirthYear: input('participantBirthYear'),
        schoolTypeOther: clickButton('schoolTypeOther'),
        schoolTypeOtherText: input('schoolTypeOtherText'),
        additionalInfo: input('additionalInfo')
    },
    clickContinue: clickLabeledButton('Register'),
    progressMessage: textAtClass('.form-title'),
    validationErrors: textAtClass('.validationErrors')
};
