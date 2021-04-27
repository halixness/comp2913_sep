/*
    addCard.js
        -- Front end functions for adding a new card to strip and the database,
        uses provided stripe template
        
    Contributers
        -- Samuel Barnes
        -- Artyom Tiunelis
*/


// A reference to Stripe.js
var stripe;

//activity ID is stored here
var queryString = window.location.pathname.split("/");

//csrf token
var csrfToken = document.getElementsByName("_csrf")[0].value;


// Disable the button until we have Stripe set up on the page
document.querySelector("#submit").disabled = false;

fetch("/pay/stripe-key")
  .then(function(result) {
    return result.json();
  })
  .then(function(data) {
    return setupElements(data);
  })
  .then(function({ stripe, card, clientSecret }) {

    document.querySelector("button").disabled = false;

    var form = document.getElementById("payment-form");
    
    form.addEventListener("submit", function(event) {

      event.preventDefault();

      // remove error on submit
      var errorMsg = document.querySelector(".sr-field-error");
      errorMsg.textContent = "";

      addCard(stripe, card, clientSecret);

    });
});


/*
*   Function:   setup stripe elements
*   Input:      clientsecret
*/
var setupElements = function(data) {
  stripe = Stripe(data.publishableKey);
  /* ------- Set up Stripe Elements to use in checkout form ------- */
  var elements = stripe.elements();

  var card = elements.create("card" );
  card.mount("#card-element");

  return {
    stripe: stripe,
    card: card,
    clientSecret: data.clientSecret
  };
};


/*
*   Function:   handle user action
*   Input:      clientsecret
*/
var handleAction = function(clientSecret) {
  stripe.handleCardAction(clientSecret).then(function(data) {

    if (data.error) {
      showError("Your card was not authenticated, please try again");

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
            showError(json.error);
          } else {
            orderComplete(clientSecret);
          }
        });
    }
  });
};


/*
*   Function:   add card to stripe (and db)
*   Input:      stripe object, card object
*/
var addCard = function(stripe, card) {
  changeLoadingState(true);

  fetch("/pay/setup-intent",{
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'X-CSRF-Token': csrfToken
    },
    body: null
    }).then(function(result) {
      return result.json();

    }).then(function(result) {
      if (result.error) {
        // Display error.message in your UI.
        showError(json.error);
      } else {

        // The setup has succeeded. Display a success message.
        stripe.confirmCardSetup(
          result.clientSecret,
          {
            payment_method: {
              card: card,
            },
          }
        ).then(function(result) {
          if (result.error) {
            // Display error.message in your UI.
            showError(result.error);
          } else {
            // The setup has succeeded. Display a success message.

            changeLoadingState(true);

            $.ajax (
            {
              url: "/user/account/add/card",
              type: "POST",
              headers: {
                "Content-Type": "application/json",
                'X-CSRF-Token': csrfToken,
                },
              data: JSON.stringify(result.setupIntent),
              success: function(data) {
                data = JSON.parse(data);

                if (data.result == "success") {
                  console.log("is it getting here??");
                  location.reload();
                  return;
                } else {
                  if (data.message.code) {
                    alert(data.message.code);
                  } else {
                    console.log(data);
                    showError(data.message);
                  }
                }
                
              },
              error: function(error) {
                alert(error);
              }
            });
          }
        });
      }
    });
};


/* ------- Post-payment helpers ------- */

/* Shows a success / error message when the payment is complete */
var orderComplete = function(clientSecret) {
  stripe.retrievePaymentIntent(clientSecret).then(function(result) {

    var paymentIntent = result.paymentIntent;
    var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

    document.querySelector(".sr-payment-form").classList.add("hidden");
    document.querySelector("pre").textContent = paymentIntentJson;

    // CALL AJAX HERE TO PROCESS PAYMENT

    changeLoadingState(false);
  });
};


/*
*   Function: render the error to the page
*   Input:    string: error message
*/
var showError = function(errorMsgText) {
  changeLoadingState(false);
  var errorMsg = document.querySelector(".sr-field-error");
  errorMsg.textContent = errorMsgText.message;
};

// Show a spinner on payment submission
var changeLoadingState = function(isLoading) {
  if (isLoading) {
    document.querySelector("#submit").disabled = true;
    document.querySelector(".payment__spinner--card").classList.remove("payment__spinner--hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector(".payment__spinner--card").classList.add("payment__spinner--hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};
