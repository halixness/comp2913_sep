/*
    facility.js
        -- functions for payment of a new membership or activity, including the 
        process of booking a new activity / creating a new membership 

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
var db = require('./db.js');
var user = require('./user.js');
var QRCode = require('qrcode');
var nodemailer = require('nodemailer');
var ejs = require('ejs');
var path = require('path');


/*
 *  Function:   Send a membership brought email confirmation
 *  Input:      Id of user to send email to, id of pricing, id of membership brought
 *  Output:     Email to user; user.email
*/
const sendMembershipEmailConfirmation = async function(userId, pricingId, membershipId) {
    var details = await db.getMembership(membershipId);
    var id = 'M' + details.id.toString();
    var qr = await QRCode.toDataURL('M' + details.id.toString());
    
    var name;
    if (details.type == 1)
        name =  '1 Month ' + details.name + ' membership';
    else if (details.type == 2)
        name = '1 Year ' + details.name + ' membership';
    else if (details.type == 3)
        name = '1 Year Sports Pass membership';

    var description = 'Starting ' + details.start_date;
    var price = details.price;

    var card;
    if (details.number == '0000')
        card = 'Edgy Gym membership'
    else
        var card = 'card ending in ' + details.number;

    // Send the email
    sendEmailConfirmation(userId, {
        id : id,
        qr: qr,
        name: name,
        description: description,
        price: price,
        card: card,
    })
};


/*
 *  Function:   Send a activity booking email confirmation
 *  Input:      Id of user to send email to, id of booked activity booked
 *  Output:     Email to user; user.email
*/
const sendActivityEmailConfirmation = async function(userId, bookedActivityId){
    var details = await db.getBookedActivity(bookedActivityId);
    var id = 'A' + details.id.toString();
    var qr = await QRCode.toDataURL('A' + details.id.toString());

    var name = details.name_activity;
    var description = details.name_sport + ' activity, ' + details.duration + ' minutes from ' + details.start_time;
    var price = details.price;
    
    var card;
    if (details.number == '0000')
        card = 'Edgy Gym membership'
    else
        var card = 'card ending in ' + details.number;

    // Send the email
    sendEmailConfirmation(userId, {
        id : id,
        qr: qr,
        name: name,
        description: description,
        price: price,
        card: card,
    })
};


/*
 *  Function:   Send a confirmation email to the user
 *  Input:      Id of user to send email to, payment details (attributes)
 *  Output:     Email to user; user.email
*/
const sendEmailConfirmation = async function(userId, payment_details) {
    console.log('emailing');

    // Set QR code
    var user_details = await user.getDetails(userId);

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'leeds.comp2913.sep.17@gmail.com',
            pass: 'edgyGym2001'
        }
    });

    var html = await ejs.renderFile(path.join(__dirname + '/../views/email/payment-confirmation.ejs'),
    {
        details: payment_details
    });

    // Send the email to the user
    var info = await transporter.sendMail({
        from: '"Edgy Gym" <leeds.comp2913.sep.17@gmail.com>',
        to: user_details.email,
        subject: payment_details.id + ' payment confirmation',
        html: html,
        attachments: [{
            filename: 'logo.png',
            path: path.join(__dirname + '/../src/img/icons/logo.png'),
            cid: 'logo'
        }]
    });
};


/*
 *  Function:   Pre-processing of Payment with check
 *  Input:      Res, Req, Webname, Activity, User {id}, Card {id}
 *  Output:     Error Message
*/
exports.processMembershipPayment = function(pricingId, userId, cardId){

    return new Promise(function(resolve, reject) {

        // Get cost
        db.getPricingAmount(pricingId).then(function(pricingCost){

            //Please keep the methods for object-level processing. 
            db.getUserDetails(userId).then(function(userObj){

                // Generate Membership
                db.createMembership(userId, pricingId).then(function(membershipId){

                    // Generate payment
                    module.exports.generateMembershipPayment(membershipId, pricingCost, userId, cardId).then(function(paymentId){

                        sendMembershipEmailConfirmation(userId, pricingId, membershipId);
                        // Return successful payment id with redirect
                        resolve(paymentId); 

                    // Payment failure
                    }).catch(function(err){

                        reject(err);
                    });

                // Membership error
                }).catch(function(err){
                    
                    reject(err);
                });

            // User details error
            }).catch(function(err){

                reject(err);
            });

        // Pricing error
        }).catch(function(err){
        
            reject(err);
        });
    });
}


/*
 *  Function:   Pre-processing of Payment with check
 *  Input:      Res, Req, Webname, Activity, User {id}, Card {id}
 *  Output:     Error Message
*/
exports.processBookingPayment = function(activityId, userId, cardId){

    return new Promise(function(resolve, reject) {

        // Get Activity details
        db.getActivityObj(activityId).then(function(activityObj){
            db.getBookedCapacity(activityId).then(function(bookedCapacity) {

                if (bookedCapacity.capacity >= activityObj.capacity) {
                    return reject("This activity is fully booked");
                }

                module.exports.getBookingPrice(userId, activityObj).then(function(cost) {
                
                    // Generate BookingActivity
                    module.exports.generateActivityBooking(activityObj.id).then(function(bookedActivityId){
                        
                        // Generate payment
                        module.exports.generateBookingPayment(bookedActivityId, cost, userId, cardId).then(function(paymentId){

                            sendActivityEmailConfirmation(userId, bookedActivityId);
                            // Successful payment
                            resolve(paymentId);

                        // Payment failure
                        }).catch(function(err){
                            reject(err);
                        });

                    // Booking Failure
                    }).catch(function(err){
                        reject(err);
                    });

                // Getting cost error
                }).catch(function(err) {
                    reject(err);
                });

            // Booked Capacity error
            }).catch(function(err) {
                reject(err);
            });
            
        // Activity Error
        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Process free booking
 *  Input:      Id of activity being booked, Id of user making the booking
 *  Output:     Error Message / Bool
*/
exports.processBookingPaymentFree = function(activityId, userId) {
    return new Promise(function(resolve, reject) {
        db.getActivityObj(activityId).then(function(activityObj) {

            module.exports.generateActivityBooking(activityObj.id).then(function(bookedActivityId) {
                
                // Generate payment // card 2 is free payments
                module.exports.generateBookingPayment(bookedActivityId, 0, userId, 2).then(function(paymentId){

                    sendActivityEmailConfirmation(userId, bookedActivityId);
                    // Successful payment
                    resolve(paymentId);

                // Payment failure
                }).catch(function(err){

                    reject(err);
                });

            // Error generating activity booking
            }).catch(function(err) {
                reject(err);
            });
     
        // Error get activity object
        }).catch(function(err) {
            reject(err);
        });
    });
}


/*
 *  Function:   Generate Booking Activity Obj
 *  Input:      Activity {id}
 *  Output:     BookedActivity {id} / Error Message
*/
exports.generateActivityBooking = function(idActivity){

    return new Promise(function(resolve, reject) {

        db.generateActivityBooking(idActivity).then(function(result){

            // Result
            resolve(result)

        }).catch(function(err){

            reject(err);
        })
    });
}


/*
 *  Function:   Generate Booking Payment Obj
 *  Input:      BookedActivity {id}, Activity {cost}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generateBookingPayment = function(bookedActivityId, activityCost, userId, cardId){

    return new Promise(function(resolve, reject) {

        db.generateBookingPayment(bookedActivityId, activityCost, userId, cardId).then(function(result){

            // Result
            resolve(result)

        }).catch(function(err){

            reject(err);
        })
    });
}


/*
 *  Function:   Generate Booking Payment Obj
 *  Input:      Membership {id}, Pricing {amount}, User {id}, Card {id}
 *  Output:     Payment {id} / Error Message
*/
exports.generateMembershipPayment = function(membershipId, cost, userId, cardId){

    return new Promise(function(resolve, reject) {

        db.generateMembershipPayment(membershipId, cost, userId, cardId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get price of an activity given user membership
 *  Input:      Id of user to get price for, Activity obj for pricing
 *  Output:     Error Message / Int: price
*/
exports.getBookingPrice = function(userId, activityObj) {
    return new Promise(function(resolve, reject) {

        user.getMemberships(userId).then(function(memberships) {

            var price = activityObj.cost;

            if (memberships.length > 0) {                       // if there is a membership
                for (var i = 0; i < memberships.length; i++) {
                    if (!memberships[i].expired) {              // if the membership is not expired
                        if (memberships[i].type == 3) {         // if they have a sports pass always return true
                            
                            price = 0;

                            if (activityObj.discount > 0)       // if theres a discount on the activity, apply it
                                price = activityObj.cost - activityObj.discount;
                        
                        } else if (memberships[i].type < 3) { 
                            if (memberships[i].id_sport == activityObj.id_sport) { // if their membership is for the same sport, return true
                                
                                price = 0;

                                if (activityObj.discount > 0)   // if theres a discount on the activity, apply it
                                    price = activityObj.cost - activityObj.discount;
                            }
                        }
                    }
                }
            }   

            // Result
            resolve(price);

        // Error getting user memberships
        }).catch(function(err) {
            reject(err);
        });
    });
}


/*
 *  Function:   Get price of membership by pricing Id
 *  Input:      Id of pricing to get membership price from
 *  Output:     Error Message / pricing obj
*/
exports.getMembershipPrice = function(pricingId) {
    return new Promise(function(resolve, reject) {
        db.getPricingDetails(pricingId).then(function(result) {

            if (result.type == 2) {
                db.getPricingByType(1).then(function(monthly) {

                    for (var j = 0; j < monthly.length; j++) {
                        if (monthly[j].id_sport == result.id_sport) {
                            result.monthly = monthly[j].amount * 12;
                            result.savings = ((monthly[j].amount * 12) - result.amount).toFixed(2);

                        }
                    }

                    // Result of membership type 2
                    resolve(result);

                }).catch(function(err) {
                    reject(err);
                });
            } else {

                // Result of membership type != 2
                resolve(result);
            }

        // Error getting pricing details
        }).catch(function(err) {
            reject(err);    
        });
    });
}



