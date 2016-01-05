$(document).ready(function(){
    checkUrlHash();
    showButtons();
    updateProgressHeader(window.location.hash);
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
    updateProgressHeader(window.location.hash);
});

$('#details-continue-button').click(function () {
    showPaymentForm();
    window.location.hash = 'payment';
    updateProgressHeader(window.location.hash);
});

$("#details-go-back").click(function(){
    showEligibilityForm();
    window.location.hash = 'eligibility';
    updateProgressHeader(window.location.hash);
});

$("#payment-go-back").click(function(){
    showDetailsForm();
    window.location.hash = 'details';
    updateProgressHeader(window.location.hash);
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

function updateProgressHeader(stage){
    switch(stage){
        case '#details':
            $('#progress-details').attr('class','active');
            $('#progress-eligibility').attr('class','visited');
            $('#progress-payment').attr('class','unvisited');
            $('#progress-finished').attr('class','unvisited');
            break;
        case '#payment':
            $('#progress-details').attr('class','visited');
            $('#progress-eligibility').attr('class','visited');
            $('#progress-payment').attr('class','active');
            $('#progress-finished').attr('class','unvisited');
            break;
        case '#eligibility':
            $('#progress-details').attr('class','unvisited');
            $('#progress-eligibility').attr('class','active');
            $('#progress-payment').attr('class','unvisited');
            $('#progress-finished').attr('class','unvisited');
            break;
        default:
            break;
    }
}
