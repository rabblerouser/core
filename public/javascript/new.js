$(document).ready(function(){
    checkUrlHash();
    showButtons();
});

function showButtons(){
    $('#eligibility-continue-button').show();
    $('#details-continue-button').show();
    $('#details-go-back').show();
    $('#payment-go-back').show();
}

function showEligibilityForm(){
    $('#eligibility-form').show();
    $('#details-form').hide();
    $('#payment-form').hide();
}

function showDetailsForm(){
    $('#eligibility-form').hide();
    $('#details-form').show();
    $('#payment-form').hide();
}

function showPaymentForm(){
    $('#eligibility-form').hide();
    $('#details-form').hide();
    $('#payment-form').show();
}

$('#eligibility-continue-button').click(function(){
    showDetailsForm();
    window.location.hash = 'details';
});

$('#details-continue-button').click(function () {
    showPaymentForm();
    window.location.hash = 'payment';
});

$("#details-go-back").click(function(){
    showEligibilityForm();
    window.location.hash = 'eligibility';
});

$("#payment-go-back").click(function(){
    showDetailsForm();
    window.location.hash = 'details';
});

function checkUrlHash(){
    switch(window.location.hash) {
        case '#details':
            showDetailsForm();
            break;
        case '#payment':
            showPaymentForm();
            break;
        case '#eligibility':
            showEligibilityForm();
            break;
        default:
            window.location.hash = "eligibility";
            showEligibilityForm();
            break;
    }
}
