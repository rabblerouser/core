$(document).ready(function (){
  var handler = StripeCheckout.configure({
      key: 'pk_test_4SqBME7pIDAKSWRft4OpviYK',
      image: '/images/logo.svg',
      locale: 'auto',
      token: function(token) {
        $.post( "/invoices",
                {
                  memberEmail: $('#memberEmail').val(),
                  totalAmount: $('#totalAmount').val(),
                  paymentType: 'credit/debit card',
                  stripeToken: token
                });
      }
    });

  $('#pay-by-credit-card-button').on('click', function(e) {
    handler.open({
      name: 'Pirate Party',
      description: 'membership application',
      amount: parseFloat($('#totalAmount').val()) * 100
    });
    e.preventDefault();
  });
});

// Close Checkout on page navigation
$(window).on('popstate', function() {
  handler.close();
});
