/*
    paymentRoutes.js
        -- Routes to facilitate payment, booking an activity or 
        buying a membership
        
    Contributers
        -- Samuel Barnes
        -- Artyom Tiunelis
*/


// Variable declarations
const express = require('express');
const validation = require('../modules/validation');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var error = require('../modules/error');
var report = require('../modules/report');
var facility = require('../modules/facility');
var employee = require('../modules/employee');
var payment = require('../modules/payment');
const url = require('url');
var busboy = require('busboy');
var fs = require('fs');


// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));


// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Booking payment page
 *  Input:      Id of activity being booked
*/
router.get('/booking/:id*', function(req, res) {

    activityId = req.params['id'];
    page = 1;

    if (req.session.userId == undefined) {
        req.session.from = "/payment" + req.url;
        res.redirect('/user/login');
    } else {
        // Managers shouldnt be able to book things
        if (req.session.userType > 2) {
            back = req.header('Referer') || '/';
            attr = url.parse(back, true).query;
            back = url.parse(back, true).pathname;
            connective = "?";

            if (attr.id) {  // if theres an id param in url
                back += "?id=" + attr.id;
                connective = "&";
            }
            
            // redirect
            res.redirect(back + connective + "admin=" + activityId);

        } else {
            if (req.query.page && Number(req.query.page) == 2)
                page = req.query.page;

            user.getActivity(activityId).then(function(activity) {

                user.getActivityBookedCapacity(activityId).then(function(bookedCapacity) {

                    // Check capacity isnt full
                    if (bookedCapacity.capacity >= activity.capacity) {
                        back = req.header('Referer') || '/';
                        attr = url.parse(back, true).query;
                        back = url.parse(back, true).pathname;
                        connective = "?";
            
                        if (attr.id) {  // if theres an id param in url
                            back += "?id=" + attr.id;
                            connective = "&";
                        }
                        
                        // redirect
                        res.redirect(back + connective + "full=" + activityId);

                    } else {
                        payment.getBookingPrice(req.session.userId, activity).then(function(cost) {

                            activity.original_cost = activity.cost;
                            activity.cost = cost;

                            // they have the correct membership so get the booking for free
                            if (activity.cost == 0) { 

                                payment.processBookingPaymentFree(activity.id, req.session.userId, 2).then(function(paymentId) {
        
                                    console.log("Booking id received, payment free: " + paymentId);
                                    res.redirect("/user/account/bookings");
        
                                }).catch(function(err) {
                                    error.defaultError(req, res, webname, err);
        
                                }); 
        
                            // They dont have the correct membership so have to pay for the booking
                            } else {          
        
                                // User details
                                user.getDetails(req.session.userId).then(function(userDetails) {
        
                                    // Cards
                                    user.getCards(req.session.userId).then(function(cards){
                                        var cardId = 0;
                                        if (cards.length > 0) cardId = cards[0].id;
        
                                        console.log(activity);

                                        // Render
                                        res.render(path.join(__dirname + '/../views/pages/payment/payment-booking.ejs'),
                                        {
                                            title: webname + "| Payment | Membership",
                                            session: req.session,
                                            activity: activity,
                                            pricing: activity.cost,
                                            user: userDetails,
                                            cards: cards,
                                            form: req.body,
                                            csrfToken: req.csrfToken(),
                                            page: page
                                        });
        
                                    // Error getting user cards
                                    }).catch(function(err){
                                        error.defaultError(req, res, webname, err);
                                    });
        
                                // Error getting user details
                                }).catch(function(err) {
                                    error.defaultError(req, res, webname, err);
                                });
                            }
        
                        // Error getting activity payment price
                        }).catch(function(err) {
                            error.defaultError(req, res, webname, err);
                        });
                    }

                // Error getting activity booked capacity
                }).catch(function(err) {
                    error.defaultError(req, res, webname, err);
                });

            // Error getting the activity
            }).catch(function(err) {
                error.defaultError(req, res, webname, err);            
            });
        }
    }
});


/*
 *  Function:   Render membership
 *  Input:      req, res, type of membership
 *  Output:     Error message / render membership page
*/
function renderMembership(req, res, type) {
    facility.getPricingByType(type).then(function(pricing) {

        // User details
        user.getDetails(req.session.userId).then(function(userDetails) {

            // Cards
            user.getCards(req.session.userId).then(function(cards){
                var cardId = 0;
                if (cards.length > 0) cardId = cards[0].id;

                // Render
                res.render(path.join(__dirname + '/../views/pages/payment/payment-membership.ejs'),
                {
                    title: webname + "| Payment | Membership",
                    session: req.session,
                    user: userDetails,
                    cards: cards,
                    form: req.body,
                    pricing: pricing,
                    type: type,
                    csrfToken: req.csrfToken(),
                    option: option
                });

            // Error getting user cards
            }).catch(function(err){

                error.defaultError(req, res, webname, err);
            });   

        // Error getting user details
        }).catch(function(err) {

            error.defaultError(req, res, webname, err);
        });

    // Error getting pricing by type
    }).catch(function(err) {

        error.defaultError(req, res, webname, err);
    });
}


/*
 *  Function:   Membership payment page
 *  Input:      Id of membership type being brought
*/
router.get('/membership/:id*', function(req, res) {

    var type = req.params['id'];
    option = 0;

    // If user not logged in -> store url intent -> redirect login
    if (req.session.userId == undefined) {
        
        req.session.from = "/payment" + req.url;
        res.redirect('/user/login');

    // Else render payment page
    } else {
        if (req.query.option) {
            option = req.query.option;

            payment.getMembershipPrice(option).then(function(optionObj) {
                if (optionObj.type != type) {
                    res.status(404).render(path.join(__dirname + '/../views/pages/error-404.ejs'), {
                        title: "Page not found",
                        session: req.session
                    });

                // type exists
                } else {
                    renderMembership(req, res, type);
                }

            // Error getting payment price
            }).catch(function(err) {
                error.defaultError(req, res, webname, err);
            });

        // no membership type option in url
        } else {
            renderMembership(req, res, type);
        }       
    }
});


// Exports
module.exports = router;
