/*
    user.js
        -- functions for user routes, or for facilitating user actions throughout
        the webtsite

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
var db = require('./db.js');
var md5 = require('md5');
var moment = require('moment');
var QRCode = require('qrcode');


/*
 *  Function:   Check email registration
 *  Input:      Username, password
 *  Output:     Error Message
*/
exports.checkEmailRegistered = function(email){

    return new Promise(function(resolve, reject) {

        db.checkEmailRegistered(email).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Login User 
 *  Input:      Username, password
 *  Output:     Error Message
*/
exports.loginUser = function(email, password){

    // Md5 encryption
    password = md5(password);

    return new Promise(function(resolve, reject) {

        db.queryUser(email, password).then(function(user){

            // Result
            resolve(user);

        }).catch(function(err){

            reject(err);
        });
    });
}


 /*
 *  Function:   Update User Details
 *  Input:      Id, Name, Surname, Email, Phone from request body
 *  Output:     Error Message
*/
exports.updateDetails = function(req_body) {
    let id = req_body.id;
    let name = req_body.name;
    let surname = req_body.surname;
    let email = req_body.email;
    let phone = req_body.phone;

    return new Promise(function(resolve, reject) {

        db.updateUserDetails(id, name, surname, email, phone).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


 /*
 *  Function:   Update User Address
 *  Input:      Id, Address_1, Address_2, Zipcode, City from request body
 *  Output:     Error Message
*/
exports.updateAddress = function(req_body) {
    let id = req_body.id;
    let address_1 = req_body.address_1;
    let address_2 = req_body.address_2;
    let zipcode = req_body.zipcode;
    let city = req_body.city;

    return new Promise(function(resolve, reject) {

        db.updateUserAddress(id, address_1, address_2, zipcode, city).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


 /*
 *  Function:   Update User Password
 *  Input:      Id, password City from request body
 *  Output:     Error Message
*/
exports.updatePassword = function(req_body) {
    let id = req_body.id;
    let current_password = req_body.current_password;
    let password = req_body.password;
    let confirm_password = req_body.confirm_password;

    // Md5 encryption
    current_password = md5(current_password);
    password = md5(password);
    confirm_password = md5(confirm_password);
    
    if(password != confirm_password) throw "Passwords not matching.";


    return new Promise(function(resolve, reject) {

        db.updateUserPassword(id, password, current_password).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });   
}


 /*
 *  Function:   Update User Stripe Token
 *  Input:      Id, Stripe token
 *  Output:     Error Message
*/
exports.updateStripeToken = function(id, token) {

    return new Promise(function(resolve, reject) {
        db.updateUserStripeToken(id, token).then(function(result){

            // Result
            resolve(result);
            
        }).catch(function(err){

            reject(err);
        });
    });   
}


/*
 *  Function:   Create New User 
 *  Input:      name, surname, email, phone No., address line 1, address line 2, zipcode, city, password, confirm password
 *  Output:     Bool / Error Message
*/
exports.registerUser = function(req_body){

    // Parameters
    let name = req_body.name;
    let surname = req_body.surname;
    let phone = req_body.phone;
    let address_1 = req_body.address_1;
    let address_2 = req_body.address_2;
    let zipcode = req_body.zipcode;
    let city = req_body.city;
    
    var d = req_body.birth.split("-");
    var dTimestamp = d[1] + "/" + d[2] + "/" + d[0];
    let birth = new Date(dTimestamp).getTime();
    birth = moment(birth).format('YYYY-MM-DD HH:mm:ss');

    let email = req_body.email;
    let password = req_body.password;
    let confirm_password = req_body.confirm_password;
    let userType = req_body.type;

    // Md5 encryption
    password = md5(password);
    confirm_password = md5(confirm_password);

    // Check password and confirm password fields match
    if(password != confirm_password) throw "Passwords not matching.";

    return new Promise(function(resolve, reject) {

        db.createUser(name, surname, email, password, userType, phone, address_1, address_2, zipcode, city, birth).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Sets user session variable
 *  Input:      Requst Object, Email
 *  Output:     Bool / Error Message
*/
exports.setUserSession = function(req, email){

    return new Promise(function(resolve, reject) {

        db.getUserIdType(email).then(function(user){

            // Sets session variable
            req.session.userId = user.id;
            req.session.userType = user.type;

            // Result
            resolve(true);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get User Details
 *  Input:      Id of user to get details for
 *  Output:     Error Message / user object
*/
exports.getDetails = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserDetails(id).then(function(user){

            // Result
            resolve(user);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get User's memberships
 *  Input:      User {id}
 *  Output:     Membership / Error Message
*/
exports.getMemberships = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserMemberships(id).then(function(memberships){

            // Formatting date
            for(i = 0; i < memberships.length; i++){

                // Validity
                if(memberships[i].type == 1)
                    memberships[i].validity = 31;
                
                else
                    memberships[i].validity = 365;

                // Formatting
                var mysql_date = memberships[i].start_date;

                var now = moment();

                let date = mysql_date.getTime();
                dateStr = moment(date).format('DD/MM/YYYY HH:mm');
                
                // Validity check
                memberships[i].start_date = dateStr;
                memberships[i].expired = (moment(date).add(memberships[i].validity, 'days').diff(now, 'days') < 0);
            }

            // Result
            resolve(memberships);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Cancel User's Membership
 *  Input:      User {id}, Membership {id}
 *  Output:     Boolean Result / Error Message
*/
exports.cancelMembership = function(userId, membershipId){

    return new Promise(function(resolve, reject) {

        db.cancelMembership(userId, membershipId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Cancel User's Credit Card
 *  Input:      User {id}, Membership {id}
 *  Output:     Boolean Result / Error Message
*/
exports.deleteCard = function(userId, cardId){

    return new Promise(function(resolve, reject) {

        db.deleteUserCard(userId, cardId).then(function(result){

            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get User Bookings
 *  Input:      User {id}
 *  Output:     Bookings / Error Message
*/
exports.getBookings = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserBookings(id).then(async function(result){

            // Formatting date and set QR code
            for(var i = 0; i < result.length; i++){

                // Formatting date
                let date = result[i].start_time.getTime();
                date = moment(date).format('DD/MM/YYYY HH:mm:ss');
                result[i].start_time = date;

                // Set QR code
                await QRCode.toDataURL('A' + result[i].id.toString()).then(function(url,err) {
                    result[i].qr = url;
                });
            }
            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Delete Booked Activity
 *  Input:      BookedActivity Id
 *  Output:     Boolean Result / Error Message
*/
exports.cancelBooking = function(id){

    return new Promise(function(resolve, reject) {

        db.cancelBooking(id).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   get Upcoming activities
 *  Input:      No Items, Page No, filters (attributes)
 *  Output:     Error Message / activities (array of objects)
*/
exports.upcomingActivities = function(no_items, page_no, filters){

    return new Promise(function(resolve, reject) {

        db.getUpcomingActivities(no_items, page_no, filters).then(function(result){
          
            for (var i = 0; i < result[1].length; i++) {
                let date = result[1][i].start_time.getTime();
                date = moment(date).format('DD/MM/YYYY HH:mm:ss');
                result[1][i].start_time = date;
            }

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   get facilities
 *  Input:      No Items, Page No
 *  Output:     Error Message / facilities (array of objects)
*/
exports.facilities = function(no_items, page_no){

    return new Promise(function(resolve, reject) {

        db.getFacilities(no_items, page_no).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Delete a specified facility
 *  Input:      Id of facility to delete
 *  Output:     Error Message / Bool
*/
exports.deleteFacility = function(facilityId) {
    return new Promise(function(resolve, reject) {

        db.deleteFacility(facilityId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Delete a specified activity
 *  Input:      Id of activity to delete
 *  Output:     Error Message / Bool
*/
exports.deleteActivity = function(activityId) {
    return new Promise(function(resolve, reject) {

        db.deleteActivity(activityId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   get a specified activity 
 *  Input:      Id of activity to get
 *  Output:     Error Message / activity object
*/
exports.getActivity = function(activityId) {
    return new Promise(function(resolve, reject) {
        db.getActivityObj(activityId).then(function(result) {

            endTime = moment(result.start_time).add(result.duration, 'm').toDate();
            result.end_time = moment(endTime.getTime()).format('DD/MM/YYYY HH:mm:ss');

            let date = result.start_time.getTime();
            date = moment(date).format('DD/MM/YYYY HH:mm:ss');
            result.start_time = date;

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        })
    });
}


/*
 *  Function:   get a facility by id
 *  Input:      Id of facility to get 
 *  Output:     Error Message / facility object
*/
exports.facilities_discover = function(id){

    return new Promise(function(resolve, reject) {

        db.getFacility(id).then(function(results){

            // Result
            resolve(results);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Timetable for facilities, week of given date
 *  Input:      Facility id, date
 *  Output:     Error Message / activities (array of objects)
*/
exports.facilities_timetable = function(facilityId, date){
    return new Promise(function(resolve, reject) {
        db.getFacilityTimetable(facilityId, date.getDate(), date.getMonth() + 1, date.getFullYear()).then(function(result) {
            for (var i = 0; i < result.length; i++) {
                let date = result[i].start_time.getTime();
                date = moment(date).format('DD/MM/YYYY HH:mm:ss');
                result[i].start_time = date;
            }

            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Timetable for activities, week of given date
 *  Input:      activities id, date
 *  Output:     Error Message / activities (array of objects)
*/
exports.activitiesTimetable = function(date) {
    console.log(date.getYear());

    return new Promise(function(resolve, reject) {
        db.getActivitiesTimetable(date.getDate(), date.getMonth() + 1, date.getFullYear()).then(function(result) {
            for (var i = 0; i < result.length; i++) {
                let date = result[i].start_time.getTime();
                date = moment(date).format('DD/MM/YYYY HH:mm:ss');
                result[i].start_time = date;
            }

            // Result
            resolve(result);

        }).catch(function(err) {

            reject(err);
        });
    });
}


/*
 *  Function:   Get User Cards
 *  Input:      User Id
 *  Output:     Error Message / cards (array of objects)
*/
exports.getCards = function(id){

    return new Promise(function(resolve, reject) {

        db.getUserCards(id).then(function(cards){

            // Result
            resolve(cards);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   Get User Card
 *  Input:      Id of card to get
 *  Output:     Error Message / card object
*/
exports.getCard = function(cardId) {
    return new Promise(function(resolve, reject){

        db.getCardDetails(cardId).then(function(result){

            // Result
            resolve(result);

        }).catch(function(err) {
            reject(err);

        });
    });
}


/*
 *  Function:   Add new User Card
 *  Input:      User Id, Stripe card object
 *  Output:     Error Message
*/
exports.addCard = function(userId, card, stripe_id){

    return new Promise(function(resolve, reject) {

        db.createUserCard(userId, card, stripe_id).then(function(result){
            
            // Result
            resolve(result);

        }).catch(function(err){

            reject(err);
        });
    });
}


/*
 *  Function:   get payments
 *  Input:      Id of user to get payments for, Id of card of payments made
 *  Output:     Error Message / payments (array of objects)
*/
exports.getPayments = function(userId, cardId) {
    return new Promise(function(resolve, reject) {

        db.getUserPayments(userId, cardId).then(function(result) {

            for (var i = 0; i < result.length; i++) {
                // Formatting date
                var mysql_date = result[i].purchase_date;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                result[i].purchase_date = date;
            }

            // Result
            resolve(result);
            
        }).catch(function(err) {

            reject(err);    
        });
    });
}


/*
 *  Function:   get cash payments
 *  Input:      Id of user to get cash payments for
 *  Output:     Error Message / payments (array of objects)
*/
exports.getPaymentsCash = function(userId) {
    return new Promise(function(resolve, reject) {

        db.getUserPaymentsCash(userId).then(function(result) {

            for (var i = 0; i < result.length; i++) {
                // Formatting date
                var mysql_date = result[i].purchase_date;

                let date = mysql_date.getTime();
                date = moment(date).format('DD/MM/YYYY hh:mm');
                
                result[i].purchase_date = date;
            }

            // Result
            resolve(result);
            
        }).catch(function(err) {

            reject(err);    
        });
    });
}


/*
 *  Function:   get payment receipt
 *  Input:      Id of payment to get receipt for
 *  Output:     Error message / payment object
*/
exports.getPaymentReceipt = function(paymentId) {
    return new Promise(function(resolve, reject) {

        db.receiptPayment(paymentId).then(function(result) {
            
            // Result
            resolve(result);

        }).catch(function(err) {
            reject(err);
        });
    });
}


/*
 *  Function:   get activity booked capacity
 *  Input:      Id of activity to get booked capacity for 
 *  Output:     Error Message / int: capacity
*/
exports.getActivityBookedCapacity = function(activityId) {
    return new Promise(function(resolve, reject) {

        db.getBookedCapacity(activityId).then(function(result) {

            // result
            resolve(result);

        }).catch(function(err) {
            reject(err);
        });
    });
}