/*
    paymentForm.js
        -- Front end functions for facilitating payment using the stripe API,
        uses provided stripe template
        
    Contributers
        -- Samuel Barnes
        -- Artyom Tiunelis
*/



// A reference to Stripe.js
var stripe;

// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;


var handleAction = function(clientSecret) {
  stripe.handleCardAction(clientSecret).then(function(data) {

    if (data.error) {
      showErrorPayment("Your card was not authenticated, please try again");

    } else if (data.paymentIntent.status === "requires_confirmation") {

      fetch("/pay/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          paymentIntentId: data.paymentIntent.id
        })
      })
        .then(function(result) {
          return result.json();
        })
        .then(function(json) {
          if (json.error) {
            showErrorPayment(json.error);
          } else {
            orderComplete(clientSecret);
          }
        });
    }
  });
};


/*
*       document load function (on ready)
*/
$(document).ready(function(e) {
  form = document.getElementById("submit-form");

  form.addEventListener("submit", function(event) {

    event.preventDefault();

    // remove error on submit
    var errorMsg = document.querySelector(".sr-field-error");
    errorMsg.textContent = "";

    sendPayment();

  });
});


/*
* Collect card details and pay for the order
*/
function sendPayment(){

  //activity ID is stored here
  var queryString = window.location.pathname.split("/");

  //csrf token
  var csrfToken = document.getElementsByName("_csrf")[0].value;

  var type = queryString[queryString.length -2];
  var id = queryString[queryString.length -1] ;

  var cards = document.querySelector(".payment__card");
  var cardId = cards.options[cards.selectedIndex].value;

  
  if (type == 'membership') {
    var sports = document.querySelector(".membership__sport");
    var id = sports.options[sports.selectedIndex].value;
  } 

  var orderData = {
    item: { 
      type : type,
      id: id 
    },
    currency: "gbp",
    cardId: cardId
  };

  changeLoadingStatePayment(true);


  fetch("/pay/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(orderData)
  }).then(function(result) {

    return result.json();
  }).then(function(response) {

    if (response.error) {
      showErrorPayment(response.error);

    } else if (response.requiresAction) {

    // Request authentication
    //handleAction(response.clientSecret);

    } else {
      orderComplete(response.clientSecret);

      if (response.type == 'membership') {
        location.replace('/user/account/memberships');
      } else {
        location.replace('/user/account/bookings');
      }
    }
  });
}


/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {

    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

    document.querySelector(".sr-payment-form").classList.add("hidden");
    document.querySelector("pre").textContent = paymentIntentJson;

    // CALL AJAX HERE TO PROCESS PAYMENT

    changeLoadingStatePayment(false);
  });
};


/*
*   Function: render the error to the page
*   Input:    string: error message
*/
var showErrorPayment = function(errorMsgText) {
  changeLoadingStatePayment(false);
  var errorMsg = document.querySelector(".sr-field-error-payment");
  errorMsg.textContent = errorMsgText;
};


// Show a spinner on payment submission
var changeLoadingStatePayment = function(isLoading) {

  if (isLoading) {
    document.querySelector("#submit").disabled = true;
    document.querySelector(".payment__spinner--payment").classList.remove("payment__spinner--hidden");
    document.querySelector("#button-text").classList.add("hidden");

  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector(".payment__spinner--payment").classList.add("payment__spinner--hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

