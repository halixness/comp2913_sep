/*
    ajax.js
        -- Routes to facilitate ajax asynchronous calls from javascript

    Contributers
        -- Samuel Barnes
        -- Joe Jeffcock
        -- Artyom Tiunelis
        -- Diego Calanzone
*/


// Variable declarations
const express = require('express');
const router = express.Router();
var path = require('path');
const request = require('request');
var user = require('../modules/user');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const validation = require('../modules/validation');
const report = require('../modules/report');
const facility = require('../modules/facility');
var employee = require('../modules/employee');
var payment = require('../modules/payment');
var moment = require('moment');


var urlEncoded = bodyParser.urlencoded({ extended: true });
var jsonEncoded = bodyParser.json();

// Router settings
router.use(cookieParser(process.env.SESSION_SECRET));

// Website header
const webname = ' The Edgy ';


/*
 *  Function:   Register Backend Query (for Registration subform 1)
 *  Input:      first name, surname, email, password, confirm password
 *  Output:     Error message / name, surname, email, password, confirm password (json object)
*/
router.post('/register/response-1', function(req, res) {
    
    try {
        const value = validation.registerValidation1(req.body);   

        // Error
        if(value.error != undefined)
            throw value.error.details;
        
        // Email check
        user.checkEmailRegistered(req.body.email).then(function(result) {

            // Email already existing
            if(result == true) throw [{
                message: 'Email already registered',
                path: 'email'
            }];

             // Response
            res.end(JSON.stringify({
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                confirm_password: req.body.confirm_password
            }));

        }).catch(function(err){

            // Error
           res.end(JSON.stringify({
                error: err
            }));

        });

    } catch(err) {

        // Error
        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Register Backend Query (for Registration subform 2)
 *  Input:      Birth date, phone No.
 *  Output:     Error message / birth, phone (json object)
*/
router.post('/register/response-2', function(req, res) {
    
    try {
        const value = validation.registerValidation2(req.body);

        // Error
        if(value.error != undefined)
            throw value.error.details;

        // Result
        res.end(JSON.stringify({
            birth: req.body.birth,
            phone: req.body.phone
        }));

    } catch(err) {

        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Register Backend Query (for Registration subform 3)
 *  Input:      address line 1, address line 2, city, zipcode
 *  Output:     Error message / address_1, address_2, city, zipcode (json object)
*/
router.post('/register/response-3', function(req, res) {
    try {
        const value = validation.registerValidation3(req.body);
        
        // Error
        if(value.error != undefined)
            throw value.error.details;

        // Result
        res.end(JSON.stringify({
            address_1: req.body.address_1,
            address_2: req.body.address_2,
            city: req.body.city,
            zipcode: req.body.zipcode
        }));

    } catch(err) {

        res.end(JSON.stringify({
            error: err
        }));
    }
});


/*
 *  Function:   Facilities Timetable
 *  Input:      date, Id of facility to get activities for
 *  Output:     Error message / timetable (json object of results)
*/
router.post('/facility/timetable', function(req, res) {
    date = new Date(req.body.date);

    user.facilities_timetable(req.body.id, date).then(function(timetable) {

        // Result
        res.end(JSON.stringify({
            results: timetable
        }));
        
    // Error getting facilities timetable
    }).catch(function(err) {

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Activities Timetable
 *  Input:      date
 *  Output:     Error message / timetable (json object of results)
*/
router.post('/activities/timetable', function(req, res) {
    date = new Date(req.body.date);

    user.activitiesTimetable(date).then(function(timetable) {

        // Result
        res.end(JSON.stringify({
            results: timetable
        }));
    
    // Error getting activities timetable
    }).catch(function(err) {

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Activity Weekly Usage
*/
router.get('/report/overall/activity/:id*', function(req, res) {
    
    id = req.params['id'];

    report.getOverallActivityUsage(id).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Activity Weekly Usage
*/
router.post('/report/weekly/activity/', function(req, res) {
    
    // Data
    let id = req.body.id;
    let start = req.body.start;
    let end = req.body.end;

    start = moment(start).format('DD/MM/YYYY');
    end = moment(end).format('DD/MM/YYYY');

    // Query
    report.getWeeklyActivityUsage(id, start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get all activities
*/
router.get('/data/activity/all', function(req, res) {
    
    id = req.params['id'];

    facility.getAllActivities().then(function(results){

        // Render
        res.end(JSON.stringify({
            activities: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get all facilities
 *  Output:     Error message / facilities (json objects)
*/
router.get('/data/facility/all', function(req, res) {
    
    id = req.params['id'];

    facility.getAllFacilities().then(function(results){

        // Render
        res.end(JSON.stringify({
            facilities: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get all sports
 *  Output:     Error message / sports (json objects)
*/
router.get('/data/sport/all', function(req, res) {
    
    id = req.params['id'];

    facility.getAllSports().then(function(results){

        // Render
        res.end(JSON.stringify({
            sports: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Activity Weekly Usage
*/
router.get('/report/overall/facility/:id*', function(req, res) {
    
    id = req.params['id'];

    report.getOverallFacilityUsage(id).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Facility Weekly Usage
*/
router.post('/report/weekly/facility/', function(req, res) {
    
    // Data
    let id = req.body.id;
    let start = req.body.start;
    let end = req.body.end;

    start = moment(start).format('DD/MM/YYYY');
    end = moment(end).format('DD/MM/YYYY');

    // Query
    report.getWeeklyFacilityUsage(id, start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Sport Overal Usage
*/
router.get('/report/overall/sport/:id*', function(req, res) {
    
    id = req.params['id'];

    report.getOverallSportUsage(id).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Sport weekly usage
*/
router.post('/report/weekly/sport/', function(req, res) {
    
    // Data
    let id = req.body.id;
    let start = req.body.start;
    let end = req.body.end;

    start = moment(start).format('DD/MM/YYYY');
    end = moment(end).format('DD/MM/YYYY');

    // Query
    report.getWeeklySportUsage(id, start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){
        
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Login Weekly Usage
*/
router.post('/report/usage/weekly/', function(req, res) {

    // Data
    let start = req.body.start;
    let end = req.body.end;


    start = moment(start).format('DD/MM/YYYY');
    end = moment(end).format('DD/MM/YYYY');

    report.getLoginActivity(start, end).then(function(results){

        // Render
        res.end(JSON.stringify({
            results: results
        }));

    // Error
    }).catch(function(err){

        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Delete activity image
 *  Input:      Id of activity to delete from, Id of image to delete
 *  Output:     Error message / activity images 
*/
router.post('/delete/image/activity', function(req, res) {
    employee.deleteActivityImage(req.body.activityId, req.body.imageId).then(function() {
        employee.getActivityImages(req.body.activityId).then(function(result) {

            // Result
            res.end(JSON.stringify({
                results: result
            }));

        // Error getting activity images
        }).catch(function(err) {
            res.end(JSON.stringify({
                error: err
            }));
        });

    // Error deleting activity image
    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Delete facility image
 *  Input:      Id of facility to delete from, Id of image to delete
 *  Output:     Error message / facility images 
*/
router.post('/delete/image/facility', function(req, res) {
    employee.deleteFacilityImage(req.body.facilityId, req.body.imageId).then(function() {
        employee.getFacilityImages(req.body.facilityId).then(function(result) {

            // Result
            res.end(JSON.stringify({
                results: result
            }));

        // Error getting facility images
        }).catch(function(err) {
            res.end(JSON.stringify({
                error: err
            }));
        });

    // Error deleting facility image
    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   get (update?) payments
 *  Input:      Id of user to get payments for, Id of card to get payments from
 *  Output:     Error message / paymentd (json objects)
*/
router.post('/update/payment', function(req, res) {
    console.log(req.session.userId);

    user.getPayments(req.session.userId, req.body.cardId).then(function(payments) {

        // Result
        res.end(JSON.stringify({
            results: payments
        }));

    // Error getting user payments
    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get activiy by Id
 *  Input:      Id of activity to get
 *  Output:     Error message / activity object 
*/
router.post('/get/activity', function(req, res) {
    user.getActivity(req.body.activityId).then(function(activity) {

        // Result
        res.end(JSON.stringify({
            results: activity
        }));

    // Error getting activity 
    }).catch(function(err) {
        res.end(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get pricing by Id
 *  Input:      Id of pricing to get
 *  Output:     Error message / pricing object 
*/
router.post('/get/pricing', function(req, res) {
    payment.getMembershipPrice(req.body.pricingId).then(function(price) {

        // Result
        res.send(JSON.stringify({
            results: price
        }));

    // Error getting pricing
    }).catch(function(err) {
    
        res.send(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Get card by Id
 *  Input:      Id of card to get
 *  Output:     Error message / card object 
*/
router.post('/get/card', function(req, res) {
    console.log(req.body.cardId);

    user.getCard(req.body.cardId).then(function(card) {

        // Result
        res.send(JSON.stringify({
            results: card
        }));

    // Error getting card
    }).catch(function(err) {

        res.send(JSON.stringify({
            error: err
        }));
    });
});


/*
 *  Function:   Export module functions
*/
module.exports = router;
