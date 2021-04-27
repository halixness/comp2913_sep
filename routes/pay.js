/*
    pay.js
        -- Backend for stripe payment, allowing users to securely buy
        products through the website

    Contributers
        -- Samuel Barnes
        -- Artyom Tiunelis
*/


// Variable declarations
const express = require('express');
const router = express.Router();
var user = require('../modules/user');
var facility = require('../modules/facility');
var db = require('../modules/db.js');
var payment = require('../modules/payment');
var error = require('../modules/error');

var stripe = require('stripe')('sk_test_6QysuydtyRi7yOTPx9c2dtBf000bOnLDIM');

// Website header
const webname = ' The Edgy ';

//the part of the url representing the payment for the activity
const activityPaymentPart = 'booking';

//the part of the url representing the payment for the membership
const membershipPaymentPart = 'membership';


 /*
  * Function returnes stripe API public key
 */
router.get("/stripe-key", function(req, res){
    res.send({ publishableKey: "pk_test_M2OkvXhkSGXf5hSxOXXFuJn400HaRqhZZc" });
});


 /*
  * Function returnes stripe API public key
 */
router.post("/setup-intent", async function(req, res){

    if (req.session.userId == undefined) // not logged in
        res.redirect('/home');

    else {

        //getting the user object to update stripe cards.
        user.getDetails(req.session.userId).then(async function(userObj){

            //Creating a new stripe customer, if user did't have a stripe token.
            if(userObj.stripe_token == ''){
                const stripeCustomer = await stripe.customers.create({
                    email: userObj.email,
                    name: userObj.name,
                });

                stripeCustomerId = stripeCustomer.id;
                user.updateStripeToken(userObj.id, stripeCustomerId);

            }else{

                stripeCustomerId = userObj.stripe_token;
            }
            const intent =  await stripe.setupIntents.create({
                customer: stripeCustomerId,
                usage: "on_session"
            });
            res.send({clientSecret: intent.client_secret });
        });
    }
});


 /*
  * Function:   Calculate the price of the payment
  * Input:      item, Id of user
  * Output:     Error message / int: price
 */
const calculatePrice = async function(item, userId){
    // Replace this constant with a calculation of the order's amount
    // You should always calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client

    var amount = -1;

    try{
        if(item.type == membershipPaymentPart){
            amount = await facility.getPricingAmount(item.id);
            console.log(amount);

        }else if(item.type == activityPaymentPart){

            activities = await facility.getAllActivities();
            filter = activities.filter(activity => {
                return activity.id == item.id
            });
            if(filter.length < 1){

                console.log("ERROR: Request with invalid activity id.");
                return -1;
            
            }else{
                let activity = filter[0];

                amount = await payment.getBookingPrice(userId, activity); // amount with discount
            }
        }
        //amount in cents
        return amount * 100;
    }catch(e){
        console.log(e.message);
        return -1;
    }
};


 /*
  * Function:   Check an activity is fully booked
  * Input:      item
  * Output:     Error Message / Bool
 */
const checkFullyBooked = async function(item) {
    try {
        activity = await user.getActivity(item.id);

        bookedCapacity = await user.getActivityBookedCapacity(activity.id);

        console.log(bookedCapacity, activity.capacity);

        if (bookedCapacity.capacity >= activity.capacity)
            return false;

        return true;
        
    } catch(err) {
        return false;
    }
}


/*
 * Function is used to process payment, given the required parameters.
*/
router.post("/pay", async function(req, res){

    //userId is stored in the session.
    var userId = req.session.userId;

    let {item, cardId} = req.body;

    var price = await calculatePrice(item, userId);

    console.log(item.id);

    if(price < 1){
        //error occured
        return res.send({ error: "Error in price processing" });
    }

    if (item.type == activityPaymentPart) {
        full = await checkFullyBooked(item);

        if (!full) {
            return res.send({ error: "Activity already fully booked" });
        }
    }

    try {
        var user = await db.getUserDetails(userId);

        var cards = await db.getUserCards(userId);

        var filter = cards.filter(card => {
            return card.id == cardId
            });

        if(filter.length < 1){
            console.log("ERROR: Request with invalid cardId.");
            return res.send({ error: "No such card in a database" });
        }else{

            var card = filter[0];
            paymentMethodId = card.stripe_token;

        
            let intent;
            if (paymentMethodId) {
                
                // Create new PaymentIntent with a PaymentMethod ID from the client.
                intent = await stripe.paymentIntents.create({
                    amount: price,
                    currency: 'gbp',
                    payment_method_types: ['card'],
                    payment_method: paymentMethodId,
                    confirm: true,
                    customer: user.stripe_token,
                    
                    // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
                    // to take advantage of new authentication features in mobile SDKs
                    use_stripe_sdk: true,
                    receipt_email: "sc18sjb@leeds.ac.uk"
                });

                // console.log(intent);
            
            // After create, if the PaymentIntent's status is succeeded, fulfill the order.
            } 
            
            // Render response
            var result = generateResponse(userId, item, price, cardId, intent);
    
            // Return result
            res.send(result);
        }
    }catch (e) {
        console.log(e.message);
        // Handle "hard declines" e.g. insufficient funds, expired card, etc
        res.send({ error: e.message });
    }
    
});


/*
 * Function is used to decide on the action required in different cases of payment.
*/
const generateResponse = function(userId, item, price, cardId, intent){

    // Generate a response based on the intent's status
    switch (intent.status) {

        case "requires_action":
        case "requires_source_action":
            // Card requires authentication
            return {
                requiresAction: true,
                clientSecret: intent.client_secret
            };

        case "requires_payment_method":
        case "requires_source":
            // Card was not properly authenticated, suggest a new payment method
            return {
                error: "Your card was denied, please provide a new payment method"
            };


        ////////// Success

        case "succeeded":

            // ****** Membership payment ********
            if(item.type == membershipPaymentPart){
                payment.processMembershipPayment(item.id, userId, cardId).then(function(paymentId){

                    // Success redirect here
                    console.log("Membership Payment id received: " + paymentId);
                    return {status: true, type: item.type, body: paymentId};
    
                // Error catch
                }).catch(function(err){
                    
                    return {status: false, body: err};
                });
            }else if(item.type == activityPaymentPart){
                // ****** Booking payment ********
                payment.processBookingPayment(item.id, userId, cardId).then(function(paymentId){

                    // Success redirect here
                    console.log("Payment id received: " + paymentId);

                // Error catch
                }).catch(function(err){

                    console.log("there is an error " + err);

                    return {status: false, body: err}
                });
            }

            return {status: true, type: item.type, clientSecret: intent.client_secret};
    }
};


// Exports
module.exports = router;