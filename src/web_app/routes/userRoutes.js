/*
    userRoutes.js
        -- Routes for non-specific user actions, users being those who have joined
        the gym by creating an account.

    To do
        -- state which errors are occuring
        
    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
const express = require('express');
const validation = require('../modules/validation');
const PDFDocument = require('pdfkit');
const jwt = require('jsonwebtoken');
var path = require('path');
const router = express.Router();
var user = require('../modules/user');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var facility = require('../modules/facility');
var error = require('../modules/error');
var moment = require('moment');
var employee = require('../modules/employee');
const stripe = require('stripe')('sk_test_6QysuydtyRi7yOTPx9c2dtBf000bOnLDIM');

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(csurf({ cookie: true }));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Register Backend Query
*/
router.post('/register', function(req, res) {
    var nextPage = req.session.from;

    // Data validation
    try {

        const value = validation.registerValidation(req.body);

        // Error
        if(value.error != undefined)
            throw value.error.details;

        req.session.destroy();

        // Query
        user.registerUser(req.body).then(function(result){

            let email = req.body.email;

            // Success
            user.setUserSession(req, email).then(function(result){

                // Success!
                if (nextPage != undefined) {
                    res.redirect(nextPage);
                } else if (req.session.userType > 2) { // If they're a manager redirect to manager overview
                    res.redirect('/manager/overview');
                } else {
                    res.redirect('/user/account');
                }

            // Error setting user session
            }).catch(function(err){

                error.loginErrorPage(req, res, webname, [{
                    message: err,
                    path: 'unsuccessful'
                }]);
            });

        // Error registering user
        }). catch(function(err){

            error.loginErrorPage(req, res, webname, [{
                message: err,
                path: 'unsuccessful'
            }]);
        });

    // All other errors
    } catch(err) {
        error.loginErrorPage(req, res, webname, err);
    }
});


/*
 *  Function:   Login Backend Query
*/
router.post('/login', function(req, res) {
    var nextPage = req.session.from;

    try {

        // Validation
        const value = validation.loginValidation(req.body);

        if(value.error != undefined) {
            throw value.error.details;
        }

        // Data
        let email = req.body.email;
        let password = req.body.password;

        req.session.destroy();

        // Query
        user.loginUser(email, password).then(function(result){

            // Set session logged user
            user.setUserSession(req, email).then(function(result){

                // Success!
                if (nextPage != undefined) {
                    res.redirect(nextPage);
                } else if (req.session.userType > 2) { // If they're a manager redirect to manager overview
                    res.redirect('/manager/overview');
                } else {
                    res.redirect('/user/account');

                }

            // Error setting user session
            }).catch(function(err){

                error.loginErrorPage(req, res, webname, [{
                    message: err,
                    path: 'unsuccessful'
                }]);

            });

        // Error logging user in
        }). catch(function(err){

            error.loginErrorPage(req, res, webname, [{
                message: err,
                path: 'unsuccessful'
            }]);
        });

    // All other errors
    } catch(err) {

        error.loginErrorPage(req, res, webname, err);
    }
});


/*
 *  Function:   Account Page
*/
router.get('/account', function(req, res) {

    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        if (req.session.userType > 2)           // if an admin
            res.redirect('/manager/overview');

        else {

            // Get user details
            user.getDetails(req.session.userId).then(function(result) {

                // Render
                res.render(path.join(__dirname + '/../views/pages/account/account.ejs'),
                {
                    title: webname + "| Account",
                    session: req.session,
                    user: result
                });

            // Error getting user details
            }).catch(function(err) {

                error.loginErrorPage(req, res, webname);
            });
        }
    }
});


/*
 *  Function:   Logout Redirect
*/
router.get('/logout', function(req, res) {

    // Deleting session
    delete req.session.userId;

    // -> Homepage
    res.redirect('/');
});


/*
 *  Function:   Account Bookings Page Router
*/
router.get('/account/bookings', function(req, res) {

    // Session Check
    if (req.session.userId == undefined)
        res.redirect('/home');

    // Success
    else {

        if (req.session.userType > 2) 
            res.redirect('/manager/overview');

        else {
            // Get details
            user.getDetails(req.session.userId).then(function(usr) {

                user.getBookings(req.session.userId).then(function(bookings){

                    // Render details
                    res.render(path.join(__dirname + '/../views/pages/account/account-bookings.ejs'),
                    {
                        title: webname + "| Account | Bookings",
                        session: req.session,
                        bookings: bookings,
                        user: usr,
                        csrfToken: req.csrfToken()
                    });

                // Error getting user bookings
                }).catch(function(err){

                    error.defaultError(req, res, webname, err);
                });

            // error getting user details
            }).catch(function(err) {

                error.defaultError(req, res, webname, err);
            });
        }
    }
});


/*
 *  Function:   Login Details Page Router
*/
router.get('/account/details', function(req, res) {

    // Session check
    if (req.session.userId == undefined)
        res.redirect('/home');

    // Success
    else {

        if (req.session.userType > 2)
            res.redirect('/manager/overview');

        else {
                
            // Get data
            user.getDetails(req.session.userId).then(function(userObj) {

                // Render data
                res.render(path.join(__dirname + '/../views/pages/account/account-details.ejs'),
                {
                    title: webname + "| Account | Details",
                    session: req.session,
                    user: userObj,
                    csrfToken: req.csrfToken()
                });

            // Error getting user details
            }).catch(function(err) {

                error.defaultError(req, res, webname, err);
            });
        }
    }
});


/*
 *  Function:   Login Details Update Details
*/
router.post('/account/update/details', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {
        if (req.session.userType > 2) 
            res.redirect('/manager/overview');
        else {        
            try {
                id = req.body.id; // Put ID in temporary var
                delete req.body.id; // Delete ID from object so it is not validated
                const value = validation.updateDetailsValidation(req.body);
                req.body.id = id // Add ID back into object

                if(value.error != undefined)
                    throw value.error.details;

                user.getDetails(req.session.userId).then(function(userObj) {
                    user.checkEmailRegistered(req.body.email).then(function(email) {

                        // Dont compare if it is the same email
                        if (req.body.email != userObj.email) {
                            if (email == true) throw [{
                                message: 'Email already registered',
                                path: 'email'
                            }];
                        }
    
                        user.updateDetails(req.body).then(function(result) {

                            // success
                            error.updateErrorPage(req, res, webname, user, [{
                                message: 'Details Updated Successfully',
                                path: 'success'
                            }]);
        
                        // error updating user details
                        }).catch(function(err) {
                            error.updateErrorPage(req, res, webname, user, [{
                                message: err,
                                path: 'unsuccessful-details'
                            }]);
                        });
    
                    // error checking email is already registered
                    }).catch(function(err) {
                        error.updateErrorPage(req, res, webname, user, err);
                    });

                // error getting user details
                }).catch(function(err) {
                    error.updateErrorPage(req, res, webname, user, err);
                });

            // all other errors
            } catch(err) {
                error.updateErrorPage(req, res, webname, user, err);
            }
        }
    }
})


/*
 *  Function:   Login Details Update Address
*/
router.post('/account/update/address', function(req, res) {

    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        if (req.session.userType > 2) 
            res.redirect('/manager/overview');

        else {
            // Validate the data
            try {
                id = req.body.id; // Put ID in temporary var
                delete req.body.id; // Delete ID from object so it is not validated
                const value = validation.updateAddressValidation(req.body);
                req.body.id = id // Add ID back into object

                if(value.error != undefined)
                    throw value.error.details;


                user.updateAddress(req.body).then(function(result) {

                    // success
                    error.updateErrorPage(req, res, webname, user, [{
                        message: 'Address Updated Successfully',
                        path: 'success'
                    }]);

                // error updating user address
                }).catch(function(err) {
                    error.updateErrorPage(req, res, webname, user, [{
                        message: err,
                        path: 'unsuccessful-address'
                    }]);
                });

            // all other errors
            } catch(err) {
                error.updateErrorPage(req, res, webname, user, err);
            }
        }
    }
});


/*
 *  Function:   Update Account Password
*/
router.post('/account/update/password', function(req, res) {
    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        if (req.session.userType > 2) 
            res.redirect('/manager/overview');

        else {
            try {
                id = req.body.id; // Put ID in temporary var
                delete req.body.id; // Delete ID from object so it is not validated
                const value = validation.updatePasswordValidation(req.body);
                req.body.id = id // Add ID back into object

                if(value.error != undefined)
                    throw value.error.details;

                user.updatePassword(req.body).then(function(result) {

                    // success
                    error.updateErrorPage(req, res, webname, user, [{
                        message: 'Password Updated Successfully',
                        path: 'success'
                    }]);

                // error updating user password
                }).catch(function(err) {
                    error.updateErrorPage(req, res, webname, user, [{
                        message: err,
                        path: 'current_password'
                    }]);
                });

            // all other errors
            } catch(err) {

                error.updateErrorPage(req, res, webname, user, err);
            }
        }
    }
});


/*
 *  Function:   Account Memberships Page Router
*/
router.get('/account/memberships', function(req, res) {

    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        if (req.session.userType > 2) 
            res.redirect('/manager/overview');
        else {
            // Get memberships
            user.getMemberships(req.session.userId).then(function(memberships) {

                // Get user details
                user.getDetails(req.session.userId).then(function(result) {

                    // Render
                    res.render(path.join(__dirname + '/../views/pages/account/account-memberships.ejs'),
                    {
                        title: webname + "| Account | Memberships",
                        session: req.session,
                        memberships: memberships,
                        user: result,
                        csrfToken: req.csrfToken()
                    });

                // error getting user details
                }).catch(function(err) {

                    error.defaultError(req, res, webname, err);
                });

            // error getting user memberships
            }).catch(function(err) {

                error.defaultError(req, res, webname, err);
            });
        }
    }
});


/*
 *  Function:   Account Payment Page Router
*/
router.get('/account/payment', function(req, res) {

    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        if (req.session.userType > 2) 
            res.redirect('/manager/overview');
        else {
                
            // User details
            user.getDetails(req.session.userId).then(function(result) {

                // Cards
                user.getCards(req.session.userId).then(function(cards){
                    var cardId = 0;
                    if (cards.length > 0) cardId = cards[0].id;

                    // Payment history
                    user.getPayments(req.session.userId, cardId).then(function(payments) {

                        // Cash payment history
                        user.getPaymentsCash(req.session.userId).then(function(cashPayments) {

                            // Render
                            res.render(path.join(__dirname + '/../views/pages/account/account-payment-details.ejs'),
                            {
                                title: webname + "| Account | Payment",
                                session: req.session,
                                user: result,
                                cards: cards,
                                payments: payments,
                                cashPayments: cashPayments,
                                form: req.body,
                                csrfToken: req.csrfToken()
                            });

                        // error getting cach payments
                        }).catch(function(err) {
                            console.log(err);
                        });

                    // error getting payments
                    }).catch(function(err) {

                        error.defaultError(req, res, webname, err);
                    });
                
                // error getting user cards
                }).catch(function(err){

                    error.defaultError(req, res, webname, err);
                });   

            // error getting user details
            }).catch(function(err) {

                error.defaultError(req, res, webname, err);
            });
        }
    }
});


/*
 *  Function:   display payment receipt
 *  Input:      Id of payment to display
*/
router.get('/account/payment/receipt', function(req, res) {
    if(req.session.userId == undefined) 
        res.redirect('/user/logout');

    else {
        try {

            user.getPaymentReceipt(req.query.payment_id).then(function (result){
                console.log(result);
                var doc = new PDFDocument({size: [400, 600]});
                doc.font('Courier');

                doc.text('THE EDGY GYM', {align: 'center'});
                doc.text('Woodhouse', {align: 'center'});
                doc.text('Leeds LS2 9JT', {align: 'center'});

                doc.text('\n\n');

                // date
                var date_string = moment(result.purchase_date).format('DD/MM/YYYY');
                var time_string = moment(result.purchase_date).format('hh:mm:ss');
                var curr_y = doc.y
                doc.text(date_string, doc.x, curr_y, {align: 'left'});
                doc.text(time_string, doc.x, curr_y, {align: 'right'});
                doc.text('\n');

                doc.text('\n');
                doc.text('Payment No:   ' + result.id);

                doc.text('\n\n');

                // if its a membership payment 
                if (result.membership_type != null) {
                    var membership = "";

                    if (result.membership_type == 3) 
                        membership = "Annual Sports Pass Membership";
                    else if (result.membership_type == 2)
                        membership = "Annal " + result.sport_name + " Membership";
                    else
                        membership = "Monthly " + result.sport_name + " Membership";

                    doc.text('Pricing ID: ' + result.pricing_id);
                    doc.text('Membership ID: ' + result.id_membership + '; ' + membership);

                // booking payment
                } else {
                    doc.text('Booking ID: ' + result.booking_id);
                    doc.text('Activity ID: ' + result.activity_id + '; ' + result.activity_name);
                }

                // break
                doc.text('\n\n');
                doc.text('===================================', {align: 'center'})

                // monies count
                var curr_y = doc.y
                doc.text('total:', doc.x, curr_y, {align: 'left'});
                doc.text(result.amount.toFixed(2), doc.x, curr_y, {align: 'right'});
                doc.text('\n');
                curr_y = doc.y
                
                doc.text('Payment Method:',  {align: 'left'});
                doc.text(result.type + ' ending in ' + result.number, {align: 'left'});
                doc.text('\n');

                // pipe the doc to response and end write
                doc.pipe(res);
                doc.end();

            // error getting payment receipt details
            }).catch(function(err) {

                error.defaultError(req, res, webname, err);
            });

        // Catch all other errors thrown
        } catch(err) {

            error.defaultError(req, res, webname, err);
        }
    }
}); 


/*
 *  Function:   add a payment method to the user.
*/
router.post('/account/add/card', async function(req, res) {

    var pm  = await stripe.paymentMethods.retrieve(req.body.payment_method);
    pm.card.brand = pm.card.brand.toUpperCase(); // Convert brand to upeprcase

    if (pm.card.exp_month < 10) pm.card.exp_month = '0' + pm.card.exp_month.toString(); // convert single digit to have 0 beforehand

    console.log(pm);

    if (req.session.userId == undefined)
        res.redirect('/home');

    else {

        if (req.session.userType > 2) 
            res.redirect('/manager/overview');
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

                } else
                    stripeCustomerId = userObj.stripe_token;

                try {
                    // Query
                    user.addCard(req.session.userId, pm.card, pm.id).then(function(result) {

                        req.body = {} // Clear request body so data isnt showed on reload

                        res.end(JSON.stringify({
                            message: "New Payment Method added Successfully",
                            result: "success"
                        }));
        
                    // error adding card 
                    }).catch(function(err) {    

                        res.end(JSON.stringify({
                            message: err,
                            result: "unsuccessful"
                        }));
                    });
        
                // all other errros
                } catch(err) {    
                    console.log(err);    
                    res.end(JSON.stringify({
                        message: err,
                        result: "unsuccessful"
                    }));
                }

            // error getting user details
            }).catch(function(err){     

                res.end(JSON.stringify({
                    message: err,
                    result: "unsuccessful"
                }));
            });
        }
    }
});



/*
 * Function:    new cash payment
*/
router.get('/account/payment/cash', function (req, res) {
    if(req.session.userId == undefined || req.session.userType != 2) // If not an employee
        res.redirect('/home');

    else {
        user.getDetails(req.session.userId).then(function(result) {
            employee.getEmployeePayments(req.session.userId).then(function(payments) {
                facility.getAllActivities().then(function(activities) {

                    // render
                    return res.render(path.join(__dirname + '/../views/pages/account/account-cash-payment.ejs'), {
                        title: webname + "| Account | Payments | Cash",
                        session: req.session,
                        csrfToken: req.csrfToken(),
                        user: result,
                        activities: activities,
                        payments: payments,
                        form: req.body
                    });

                // error getting all activities
                }).catch(function(err) {
                    console.log(err); // for debugging
                    res.redirect('/user/logout');
                });

            // error getting employee payments
            }).catch(function(err) {
                console.log(err);
                res.redirect('/user/logout');
            });

        // error getting user details
        }).catch(function(err) {
            console.log(err);
            res.redirect('/user/logout');
        });
    }
})


/*
 *  Function:   Cash Payment POST
*/
router.post('/account/payment/cash', function(req, res) {
    if(req.session.userId == undefined || req.session.userType != 2) // If not an employee
        res.redirect('/user/logout');

    else {
        try {
            const value = validation.cashPaymentValidation(req.body);

            // Error
            if (value.error != undefined)
                throw value.error.details;

            user.checkEmailRegistered(req.body.email).then(function(userBuying) {

                // email doesnt exist
                if (userBuying == false) throw [{
                    message: "No user exists for such email",
                    path: "email"
                }];

                user.getActivity(req.body.activity_id).then(function(activity) {

                    // cash provided is less than the cost of the activity
                    if (req.body.amount < activity.cost) throw [{
                        message: "Amount Paid cannot be less than cost of activity",
                        path: "amount"
                    }];

                    user.getActivityBookedCapacity(activity.id).then(function(bookedCapacity) {

                        // activity is already fully booked
                        if (bookedCapacity.capacity >= activity.capacity) throw [{
                            message: "This activity is fully booked",
                            path: "activity_id"
                        }];

                        employee.newCashPayment(req.body, req.session.userId).then (function (result){
                            error.cashPaymentError(req, res, webname, user, facility, employee, [{
                                message: "Cash Payment Booking created successfully",
                                path: 'success',
                                payment_id: result[1][0].id
                            }]);
    
                        // error creating new cash payment
                        }).catch(function(err) {

                            error.cashPaymentError(req, res, webname, user, facility, employee, [{
                                message: err,
                                path: 'unsuccessful'
                            }]);
                        });

                    // error getting activity booked capacity
                    }).catch(function(err) {

                        error.cashPaymentError(req, res, webname, user, facility, employee, err);
                    });

                // error getting the activity details
                }).catch(function(err) {

                    error.cashPaymentError(req, res, webname, user, facility, employee, err);
                });

            // error checking the email is already registered
            }).catch(function(err) {

                error.cashPaymentError(req, res, webname, user, facility, employee, err);
            });

        // Catch all other errors thrown
        } catch(err) {
            error.cashPaymentError(req, res, webname, user, facility, employee, err)
        }
    }
});


/*
 *  Function:   Cash Payment Receipt GET
*/
router.get('/account/payment/cash/receipt', function(req, res) {
    if(req.session.userId == undefined) // If not an employee
        res.redirect('/user/logout');

    else {
        try {

            employee.getCashPaymentReceipt(req.query.payment_id).then (function (result){
                var doc = new PDFDocument({size: [400, 600]});
                doc.font('Courier');

                doc.text('THE EDGY GYM', {align: 'center'});
                doc.text('Woodhouse', {align: 'center'});
                doc.text('Leeds LS2 9JT', {align: 'center'});

                doc.text('\n\n');

                // date
                var date = new Date(result.purchase_date);

                var date_string = moment(result.purchase_date).format('DD/MM/YYYY');
                var time_string = moment(result.purchase_date).format('hh:mm:ss');

                var curr_y = doc.y
                doc.text(date_string, doc.x, curr_y, {align: 'left'});
                doc.text(time_string, doc.x, curr_y, {align: 'right'});
                doc.text('\n');

                doc.text('\n');
                doc.text('Payment No:   ' + result.id);
                doc.text('Served by:    ' + result.employee_name + " " + result.employee_surname);
                doc.text('Employee ID:  ' + result.employee_id);

                doc.text('\n\n');

                doc.text('Booking ID: ' + result.booking_id);
                doc.text('Activity ID: ' + result.activity_id + '; ' + result.name);

                // break
                doc.text('\n\n');
                doc.text('===================================', {align: 'center'})

                // monies count
                var curr_y = doc.y
                doc.text('total:', doc.x, curr_y, {align: 'left'});
                doc.text(result.cost.toFixed(2), doc.x, curr_y, {align: 'right'});
                doc.text('\n');
                curr_y = doc.y
                doc.text('paid:', doc.x, curr_y, {align: 'left'});
                doc.text(result.amount.toFixed(2), doc.x, curr_y, {align: 'right'});
                doc.text('\n');
                curr_y = doc.y
                doc.text('change:', doc.x, curr_y, {align: 'left'});
                doc.text((result.amount - result.cost).toFixed(2), doc.x, curr_y, {align: 'right'});


                // pipe the doc to response and end write
                doc.pipe(res);
                doc.end();

            // error getting cash payment receipt details
            }).catch(function(err) {

                error.defaultError(req, res, webname, err);
            });

        // Catch all other errors thrown
        } catch(err) {

            error.defaultError(req, res, webname, err);
        }
    }
});


// exports
module.exports = router;